import React from "react";
import './LancamentoCaixa.css';
import axios from 'axios';
import { AMBIENTE, URL_CAIXA, URL_MEMBROS } from "../compartilhados/constantes";
import { formatarValor } from "../compartilhados/funcoes";
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";

export const LancamentoCaixa = (props) => {
  const { onClose, contaSel } = props;
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [dadosHistPad, setDadosHistPad] = React.useState([]);
  const [dadosMembro, setDadosMembro] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [valorHistoricoSel, setValorHistoricoSel] = React.useState(null);
  const [idMembroSel, setIdMembroSel] = React.useState(0);
  const [mesApagar, setMesApagar] = React.useState('');

  const buscarHistoricosPadroes = () => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'buscaHistoricoPadrao',
        ambiente: AMBIENTE
      }
    })
      .then(response => {
        setDadosHistPad(response.data);
        //console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };
  const buscarMembros = () => {
    setLoading(true);
    axios.get(URL_MEMBROS, {
      params: {
        ambiente: AMBIENTE,
      }
    })
      .then(response => {
        setDadosMembro(response.data);
        //console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };

  const buscaMesApagar = (id) => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'buscaMesApagar',
        id: id,
        ambiente : AMBIENTE
      }
    })
      .then(response => {
        //console.log(response.data.mesApagar);
        setMesApagar(response.data.mesApagar);
        setLoading(false);
      })
      .catch(error => {
        //console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };
  const fechaModalLancamento = () => {
    setValorHistoricoSel(null);
    setIdMembroSel(0);
    setMesApagar('');
    onClose();
  }

  const salvarDadosLancamento = (event) => {
    event.preventDefault(); // para nao dar o refresh
    const { target } = event; // pegar os inputs
    const conta = contaSel;
    //console.log(conta);
    const dataLancamento = target.dataLancamento.value;
    const valorLancamento = (target.valorLancamento.value).replace(/\./g, "").replace(",", ".");
    const usuLogado = usuarioLogado.cadastro;
    const complemento = target.complemento.value;
    axios.post(URL_CAIXA, { conta, valorHistoricoSel, idMembroSel, mesApagar, dataLancamento, valorLancamento, complemento,usuLogado, AMBIENTE }).then((resposta) => {
      toast.success(resposta);
      fechaModalLancamento();
      window.location.reload();
    }).catch((erro) => {
      toast.error(erro);
    })
  }

  React.useEffect(() => {
    if (!loading && dadosHistPad.length === 0) {
      buscarHistoricosPadroes();
      buscarMembros();
    }
  }, []);

  const pegaValorHistoricoSel = (event) => {
    setValorHistoricoSel(event.target.value);
    //console.log('Valor Sel.: ', event.target.value);
  };
  const pegaIdMembroSel = (event) => {
    setIdMembroSel(event.target.value);
   // console.log('Membro Sel.: ', event.target.value);
    buscaMesApagar(event.target.value);
  };

  const verificaRequired = () => {
    if (valorHistoricoSel == 1) {
      return (true);
    } else {
      return (false);
    }
  }
  return (
    <>
      <div className='titLancamentoCaixa'>
        <h3>Lançamento no Caixa</h3>
      </div>
      <div className='containerFormLancCaixa'>
        <form onSubmit={salvarDadosLancamento}>
          <p>Lançamento:
            <select value={valorHistoricoSel} onChange={pegaValorHistoricoSel} required>
              <option nome="selectLancamento" value="">Selecione</option>
              {dadosHistPad.map(option => (
                <option key={option.idHistorico} value={option.idHistorico}>
                  {option.status} - {option.historicoPadrao}
                </option>
              ))}
            </select>
          </p>
          <div className={valorHistoricoSel === "1" ? "" : "ocultaMembro"}>
            Nome Membro:
            <p>
              <select value={idMembroSel} onChange={pegaIdMembroSel} required={verificaRequired()}>
                <option value="">Selecione</option>
                {dadosMembro.map(opc => (
                  <option key={opc.id} value={opc.id}>
                    {opc.nome}
                  </option>
                ))}
              </select>
            </p>
            <div className="referenteMes">
              {idMembroSel > 0 ?
                <p>Referente Mês: {mesApagar}</p> : null}
            </div>
          </div>
          <p>Data Lançamento:
            <input type="date" name="dataLancamento" required />
          </p>
          <p>Valor:
            <input type="tel" name="valorLancamento" size='10' min='1' max='12' onChange={formatarValor} required />
          </p>
          <div className={valorHistoricoSel != "1" ? "" : "ocultaMembro"}>
            Complemento:
            <input type="text" name="complemento" />
          </div>
          <section>
            <button type="reset" onClick={() => { fechaModalLancamento() }} >Cancelar</button>
            <button type="submit" >Salvar</button>
          </section>
        </form>
      </div>
    </>
  )
}