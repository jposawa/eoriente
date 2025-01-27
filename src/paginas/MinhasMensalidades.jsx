import React from "react";
import './MinhasMensalidades.css';
import axios from "axios";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil"
import { usuarioLogadoAtom } from "../compartilhados/estados"

export const MinhasMensalidades = (idMembro) => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [mensPagas, setMensPagas] = React.useState([]);
  const [mensVencidas, setMensVencidas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const buscarMensPagas = (id) => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'mensalidadesPagas',
        idMembro: id,
        ambiente: AMBIENTE,
      }
    }).then((resposta) => {
      /*dadosMembros(resposta.data);*/
      console.log(resposta.data);
      if (resposta.data == 'Nenhum pagamento.') {
        setMensPagas(false);
      }
      else {
        setMensPagas(resposta.data);
      }
    }).catch((erro) => {
      toast.error("Erro na requisição, verifique sua conexão.")
      console.error('Erro no acesso:', erro);
    }).finally(() => {
      setLoading(false);
    })
  }
  const buscarMensVencidas = (id, dtIni) => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'mensalidadesVencidas',
        idMembro: id,
        dtIni: dtIni,
        ambiente: AMBIENTE,
      }
    }).then((resposta) => {
      /*dadosMembros(resposta.data);*/
      console.log(resposta.data);
      if (resposta.data == 'Nenhuma vencida.') {
        setMensVencidas(false);
      }
      else {
        setMensVencidas(resposta.data);
      }
    }).catch((erro) => {
      toast.error("Erro na requisição, verifique sua conexão.")
      console.error('Erro no acesso:', erro);
    }).finally(() => {
      setLoading(false);
    })
  }

  React.useEffect(() => {
    buscarMensPagas(usuarioLogado?.id);
    buscarMensVencidas(usuarioLogado?.id, usuarioLogado?.dataIniciacao);
  }, []);

  return (
    <>
      <div className="titMinhasMensalidades">
        <h3>Minhas Mensalidades</h3>
      </div>
      <ul className="cabMinhasMensalidades">
        <li>
          <p>
            Mês/Ano
          </p>
          <p>
            Valor
          </p>
          <p>
            Vencimento
          </p>
          <p>
            Dt.Pgto
          </p>
          <p>
            Status
          </p>
        </li>
      </ul>
      <ul className="cMensVencida">
        {/** cMensVencida  cProxMens */}
        {mensVencidas.length > 0 ? (
          mensVencidas.map((venc) => {
            return (
              <li key={venc.mesAno}>
                <p>
                  {venc.mesAno}
                </p>
                <p>
                  {venc.valor}
                </p>
                <p>
                  {venc.dataVencimento}
                </p>
                <p>
                  {venc.dataPagamento}
                </p>
                <p>
                  {venc.status}
                </p>
              </li>
            )
          })
        ) :
          <div className="msgMens">
            <p>Nenhuma mensalidade vencida !!!</p>
          </div>
        }
      </ul>
      <div className="containerMinhasMensalidades">
        <ul className="cMensPagas">
          {mensPagas.length > 0 ? (
            mensPagas.map((pagto) => {
              return (
                <li key={pagto.mesAno}>
                  <p>
                    {pagto.mesAno}
                  </p>
                  <p>
                    {pagto.valor}
                  </p>
                  <p>
                    {pagto.dataVencimento}
                  </p>
                  <p>
                    {pagto.dataPagamento}
                  </p>
                  <p>
                    {pagto.status}
                  </p>
                </li>
              )
            })
          ) :
            <div className="msgMens">
              <p>Nenhuma mensalidade paga !!!</p>
            </div>
          }
        </ul>
      </div>
    </>
  )
}