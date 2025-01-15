import React from "react";
import './TransparenciaFinanceira.css';
import { Popconfirm } from "antd";
import { CalculatorOutlined, DeleteOutlined, OrderedListOutlined, ProjectOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil"
import { usuarioLogadoAtom } from "../compartilhados/estados"
import { Link } from "react-router-dom";
import { Select } from "antd";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";
import axios from "axios";
import { toast } from "react-toastify";

export const TransparenciaFinanceira = () => {
  const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);
  const [carregando, setCarregando] = React.useState(false);
  const [listaCaixa, setListaCaixa] = React.useState([]);
  const [buscaSomasCaixa, setBuscaSomasCaixa] = React.useState([]);
  const saldoAnterior = 0;

  // Preparando para o Select mes/ano 
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let options = new Object;
  let anos = new Date();
  let mesAtual = 8; //anos.getMonth(); //array jan=0
  anos = 2020; //anos.getFullYear(); // ano atual
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
                label: 'Caixa ',
              },
              {
                value: '2',
                label: 'Tronco',
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
        {/*  <p>
          <Popconfirm
            title="Excluir Lançamento"
            description="Confirma exclusão ?"
            onConfirm={() => {
              excluirLancCaixa()
            }}
            okText="Sim"
            cancelText="Não"
          >
            <button type="button">
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </p> */}
        <p>Dia</p>
        <p>Descrição Lançamento</p>
        <p>Débito</p>
        <p>Crédito</p>
      </div>
      <ul className="containerDados">
        {
          listaCaixa.map((caixa) => {
            return (
              <li key={caixa.id}>
                <div className="dadosCaixa">
                  <p>{caixa.dataMovimento.substr(8, 2)}</p>
                  <p>
                    {caixa.historicoPadrao}
                    {caixa?.idHistorico == 1 ?
                      (` de ${caixa.nomeMembro} ref. mês ${caixa.mesAno}`) : ` ${caixa.complemento}`}
                  </p>
                  <p>
                    {caixa?.statusLancamento == "D" ? (
                      `${caixa.valor}`
                    ) : null}
                  </p>
                  <p>
                    {caixa?.statusLancamento == "C" ? (
                      `${caixa.valor}`
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
                  <p>&#x00028;Déb: {/* somaDebito */}
                    {somas.somaDebito.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&#x00029;
                  </p>
                  <p>&#x00028;Créd: {/* somaCredito */}
                    {somas.somaCredito.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&#x00029;
                  </p>
                </div>
                <div className="totaisInformados">
                  <div>
                    <p>Saldo Anterior:</p>
                    <p><b>Saldo do Mês:</b></p>
                    <p>Saldo Atual:</p>
                  </div>
                  <div>
                    <p>{/*saldoAnterior - nao esta vindo ainda da API */}
                      {somas.saldoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p> {/* saldoMes = credito - debito */}
                      <b>{(somas.somaCredito - somas.somaDebito).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                    </p>
                    <p>{/* saldo atual = saldoAnterior + saldoMes */}
                      {((somas.saldoAnterior) + (somas.somaCredito - somas.somaDebito)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          <li>
            <OrderedListOutlined />
            <p>Lançamento</p>
          </li>
        ) : null}
        <li>
          <CalculatorOutlined />
          <p>Resumo</p>
          <p>Mês</p>
        </li>
        <li>
          <ProjectOutlined />
          <p>Gráfico</p>
          <p>Mensal</p>
        </li>
        {usuarioLogado?.nivelAcesso > 3 ? (
          <li>
            <OrderedListOutlined />
            <p>Manutenção</p>
            <p>Lanç.Padrão</p>
          </li>
        ) : null}
        <li>
          <Link to='../listamembros'>
            <RollbackOutlined />
            <p>Retornar</p>
          </Link>
        </li>
      </nav>
    </>
  )
}