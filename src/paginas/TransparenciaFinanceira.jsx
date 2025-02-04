import React from "react";
import './TransparenciaFinanceira.css';
import { Popconfirm } from "antd";
import Icon, { CalculatorOutlined, DeleteOutlined, ExceptionOutlined, OrderedListOutlined, ProjectOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil"
import { usuarioLogadoAtom } from "../compartilhados/estados"
import { Link } from "react-router-dom";
import { Select } from "antd";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "../componentes/";
import { LancamentoCaixa } from "../paginas/LancamentoCaixa";
import { ResumoCaixaMes } from "../paginas/ResumoCaixaMes";
import { toMoneyBr } from "../compartilhados/funcoes";
import { GerarPDFCaixa } from './GerarPDFCaixa';
import { GerarInadimplentes } from './GerarInadimplentes';

export const TransparenciaFinanceira = () => {
  const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);
  const [carregando, setCarregando] = React.useState(false);
  const [listaCaixa, setListaCaixa] = React.useState([]);
  const [buscaSomasCaixa, setBuscaSomasCaixa] = React.useState([]);
  //// para o Modal para lançamento no caixa
  const [modalLancamento, setModalLancamento] = React.useState(false);
  const alternaModalLancamento = () => {
    setModalLancamento(!modalLancamento);
  }
  const fechaModalLancamento = () => {
    setModalLancamento(false);
  }
  //// para o Modal para Resumo Caixa Mes
  const [modalResumoCaixaMes, setModalResumoCaixaMes] = React.useState(false);
  const alternaModalResumoCaixaMes = () => {
    setModalResumoCaixaMes(!modalResumoCaixaMes);
  }
  const fechaModalResumoCaixaMes = () => {
    setModalResumoCaixaMes(false);
  }
  //// para o Modal PDF Caixa
  const [modalPDFCaixa, setModalPDFCaixa] = React.useState(false);
  const alternaModalPDFCaixa = () => {
    setModalPDFCaixa(!modalPDFCaixa);
  }
  const fechaModalPDFCaixa = () => {
    setModalPDFCaixa(false);
  }
   //// para o Modal Inadimplentes
   const [modalInadimplentes, setModalInadimplentes] = React.useState(false);
   const alternaModalInadimplentes = () => {
     setModalInadimplentes(!modalInadimplentes);
   }
   const fechaModalInadimplentes = () => {
     setModalInadimplentes(false);
   }

  // Preparando para o Select mes/ano 
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let options = new Object;
  let anos = new Date();
  let mesAtual = anos.getMonth(); //array jan=0
  anos = anos.getFullYear(); // ano atual
  let contaSel = '1';
  let mesAnoSel = (mesAtual + 1) + "/" + anos;
  if (sessionStorage.getItem('eo-contaSel')) {
    contaSel = sessionStorage.getItem('eo-contaSel');
  }
  if (sessionStorage.getItem('eo-mesAnoSel')) {
    mesAnoSel = sessionStorage.getItem('eo-mesAnoSel');
  }
  let opcs = new Array;
  for (let i = 0; i <= 17; i++) {
    options = {
      value: (mesAtual + 1) + "/" + anos,
      label: meses[mesAtual] + "/" + anos
    }
    opcs[i] = options;
    if (mesAtual == 0) {
      mesAtual = 12;
      anos--;
      mesAtual--;
    } else {
      mesAtual--;
    }
  }

  const opcCaixa = (value) => {
    contaSel = value;
    sessionStorage.setItem('eo-contaSel', contaSel);
    if (sessionStorage.getItem('eo-mesAnoSel')) {
      mesAnoSel = sessionStorage.getItem('eo-mesAnoSel');
    }

    buscarDadosCaixa(contaSel, mesAnoSel);
  }

  const opcMesAno = (value) => {
    const valor = value.padStart(7, '0');
    const mesSel = parseInt(valor.substr(0, 2));
    const anoSel = valor.substr(3, 4);
    mesAnoSel = `${mesSel + '/' + anoSel}`;
    sessionStorage.setItem('eo-mesAnoSel', mesAnoSel);
    if (sessionStorage.getItem('eo-contaSel')) {
      contaSel = sessionStorage.getItem('eo-contaSel');
    }

    buscarDadosCaixa(contaSel, mesAnoSel);
  };
  ///  final select mes/ano

  const buscarDadosCaixa = (contaSel, mesAnoSel) => {
    setCarregando(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'buscaLancamentos',
        conta: contaSel,
        mesAno: mesAnoSel.toString().padStart(7, '0'),
        ambiente: AMBIENTE
      }
    }).then((resposta) => {
      setCarregando(false);
      setBuscaSomasCaixa(resposta.data);
      setListaCaixa(resposta.data);
    }).catch((erro) => {
      // toast.error('Nenhum movimento encontrado !');
      setListaCaixa([{ "id": "", "conta": "", "dataMovimento": "", "valor": "", "complemento": "", "mesAno": "", "idHistorico": "", "historicoPadrao": "NENHUM MOVIMENTO ENCONTRADO !", "statusLancamento": "", "nomeMembro": " " }]);
      setBuscaSomasCaixa([{ "somaCredito": 0, "somaDebito": 0, "saldoAnterior": 0 }]);
      setCarregando(false);
    }).finally(() => {
      setCarregando(false);
    })
  }

  const excluirLancCaixa = (id) => {
    axios.delete(URL_CAIXA.concat("/", id)
    ).then(() => {
      //console.log(resposta.data);
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosCaixa(contaSel, mesAnoSel);
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
      console.error('Erro no acesso:', erro);
    })
  }
  React.useEffect(() => {
    if (!carregando && listaCaixa.length === 0) {
      buscarDadosCaixa(contaSel, mesAnoSel);
    }
  }, []);
  
  return (
    <>
      <div className="titTranspFinanc"><h3>Transparência Financeira</h3>
      </div>
      <div className="escolhaMes">
        <p>Conta:
          <Select
            placeholder="Selec."
            defaultValue={contaSel}
            onChange={opcCaixa}
            options={[
              {
                value: '1',
                label: 'Capítulo',
              },
              {
                value: '2',
                label: 'Solidariedade',
              },
            ]}
          />
        </p>
        <p>Mês/Ano:
          <Select
            placeholder="Selecione um mês"
            defaultValue={mesAnoSel}
            onChange={opcMesAno}
            options={opcs}
          />
        </p>
      </div>
      <div className="cabecalhoCaixa">
        <p>Dia</p>
        <p>Lançamento/Complemento</p>
        <p>Débito</p>
        <p>Crédito</p>
      </div>
      <ul className="containerDados">
        {
          listaCaixa.map((caixa) => {
            return (
              <li key={caixa.id}>
                <div className="dadosCaixa">
                  <p>
                    {caixa.dataMovimento.substr(8, 2)}
                    {usuarioLogado?.nivelAcesso == 2 || usuarioLogado?.nivelAcesso == 4 ? (
                      <p>
                        <Popconfirm
                          title="Excluir Lançamento"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirLancCaixa(caixa.id)
                          }}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <button type="button">
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      </p>
                    ) : null}
                  </p>
                  <p>
                    {caixa.historicoPadrao}
                    <div>
                      {caixa?.idHistorico == 1 ?
                        (` de ${caixa.nomeMembro} (ref. mês ${caixa.mesAno})`) : ` ${caixa.complemento}`}
                    </div>
                  </p>
                  <p>
                    {caixa?.statusLancamento == "D" ? (
                      `${toMoneyBr(caixa.valor)}`
                    ) : null}
                  </p>
                  <p>
                    {caixa?.statusLancamento == "C" ? (
                      `${toMoneyBr(caixa.valor)}`
                    ) : null}
                  </p>
                </div>
              </li>
            )
          })
        }
      </ul>
      <div className="containerSubTotais">
        {
          buscaSomasCaixa.slice(-1).map((somas) => {
            return (
              <div key={somas.id}>
                <div className="somasLancamentosMes">
                  <p>Somas Mês:</p>
                  <p>&#x00028;Déb:
                    {toMoneyBr(somas.somaDebito)}&#x00029;
                  </p>
                  <p>&#x00028;Créd:
                    {toMoneyBr(somas.somaCredito)}&#x00029;
                  </p>
                </div>
                <div className="totaisInformados">
                  <div>
                    <p>Saldo Anterior:</p>
                    <p><b>Saldo do Mês:</b></p>
                    <p>Saldo Atual:</p>
                  </div>
                  <div>
                    <p>
                      {somas.saldoAnterior < 0 ? (
                        <span className="vlrNegativo">{toMoneyBr(somas.saldoAnterior)}
                        </span>
                      ) : <span className="vlrPositivo">{toMoneyBr(somas.saldoAnterior)}
                      </span>}
                    </p>
                    <p>
                      <b>
                        {(somas.somaCredito - somas.somaDebito) < 0 ? (
                          <span className="vlrNegativo">{toMoneyBr((somas.somaCredito - somas.somaDebito))}
                          </span>
                        ) : <span className="vlrPositivo">{toMoneyBr((somas.somaCredito - somas.somaDebito))}
                        </span>}
                      </b>
                    </p>
                    <p>
                      {((somas.saldoAnterior) + (somas.somaCredito - somas.somaDebito)) < 0 ? (
                        <span className="vlrNegativo">{toMoneyBr(((somas.saldoAnterior) + (somas.somaCredito - somas.somaDebito)))}
                        </span>
                      ) : <span className="vlrPositivo">{toMoneyBr(((somas.saldoAnterior) + (somas.somaCredito - somas.somaDebito)))}
                      </span>}
                    </p>
                  </div>
                </div>
              </div>
            )
          }
          )}
      </div>

      <nav className="menuTranspFinanc">
        {usuarioLogado?.nivelAcesso > 3 ? (
          <li onClick={alternaModalLancamento}>
            <OrderedListOutlined />
            <p>Lançamento</p>
          </li>
        ) : null}
        <li onClick={alternaModalResumoCaixaMes}>
          <CalculatorOutlined />
          <p>Resumo</p>
          <p>Mês</p>
        </li>
        {usuarioLogado?.nivelAcesso == 2 || usuarioLogado?.nivelAcesso == 4 ? (
          <li onClick={alternaModalPDFCaixa}>
            <ProjectOutlined />
            <p>Gerar Arquivo</p>
            <p>PDF</p>
          </li>
        ) : null}
        {usuarioLogado?.nivelAcesso == 2 || usuarioLogado?.nivelAcesso == 4 ? (
          <li onClick={alternaModalInadimplentes}>
          <ExceptionOutlined />
          <p>Inadimplentes</p>
        </li>
        ) : null}

        {usuarioLogado?.nivelAcesso > 3 ? (
          <li>
            <Link to='../lancamentospadroes'>
              <OrderedListOutlined />
              <p>Manutenção</p>
              <p>Lanç.Padrão</p>
            </Link>
          </li>
        ) : null}
        <li>
          <Link to='../listamembros'>
            <RollbackOutlined />
            <p>Retornar</p>
          </Link>
        </li>
      </nav>
      <Modal
        className="modalPrincipal modalLancamentoCaixa"
        open={modalLancamento}
        onClose={fechaModalLancamento}
      >
        <LancamentoCaixa onClose={fechaModalLancamento} contaSel={contaSel} />
      </Modal>
      <Modal
        className="modalPrincipal ModalResumoCaixaMes"
        open={modalResumoCaixaMes}
        onClose={fechaModalResumoCaixaMes}
      >
        <ResumoCaixaMes onClose={fechaModalResumoCaixaMes} mesAnoSel={mesAnoSel} />
      </Modal>
      <Modal
        className="modalPrincipal modalPDFCaixa"
        open={modalPDFCaixa}
        onClose={fechaModalPDFCaixa}
      >
        <GerarPDFCaixa onClose={fechaModalPDFCaixa} contaSel={contaSel}  mesAnoSel={mesAnoSel} />
      </Modal>
      <Modal
        className="modalPrincipal modalInadimplentes"
        open={modalInadimplentes}
        onClose={fechaModalInadimplentes}
      >
        <GerarInadimplentes onClose={fechaModalInadimplentes} />
      </Modal>
    </>
  )
}