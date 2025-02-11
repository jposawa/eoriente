import React from "react";
import './ResumoCaixaMes.css';
import axios from "axios";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";
import { toMoneyBr } from "../compartilhados/funcoes";

export const ResumoCaixaMes = (props) => {
  const { onClose, mesAnoSel } = props;
  const [loading, setLoading] = React.useState(false);
  const parts = [];
  const [dadosResumo, setDadosResumo] = React.useState([]);
  React.useEffect(() => {
    buscarDadosResumoCaixaMes(mesAnoSel);
  }, []);

  const buscarDadosResumoCaixaMes = (mesAno) => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'resumoCaixaMes',
        mesAno: mesAno,
        ambiente: AMBIENTE
      }
    })
      .then(response => {
        setDadosResumo(response.data);
      //  console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }
  return (
    <>
      <div className="titModalResumoCaixaMes">
        <h3>Resumo do Caixa de {mesAnoSel.toString().padStart(7, '0')}</h3>
      </div>
      <div className="containerResumoCaixaMes">
        <ul>
          {
            dadosResumo.map((res) => {
              return (
                <li key={res.id}>
                  {res?.historico == 'Capítulo - Despesas:' ? (
                    <div className="destaqueSubTit">Capítulo - Despesas:</div>
                  ) : null}
                  {res?.historico == 'Capítulo - Receitas:' ? (
                    <div className="destaqueSubTit">Capítulo - Receitas:</div>
                  ) : null}
                  {res?.historico == 'Solidariedade - Despesas:' ? (
                    <div className="destaqueSubTit">Solidariedade - Despesas:</div>
                  ) : null}
                  {res?.historico == 'Solidariedade - Receitas:' ? (
                    <div className="destaqueSubTit">Solidariedade - Receitas:</div>
                  ) : null}

                  <p>
                    {res?.historico != 'Capítulo - Despesas:' && res?.historico != 'Capítulo - Receitas:' &&
                      res?.historico != 'Solidariedade - Despesas:' && res?.historico != 'Solidariedade - Receitas:' ? (
                      res.historico
                    ) : null}
                  </p>
                  <p>
                    {res.valor}
                  </p>
                </li>
              )
            })
          }
        </ul>
        <ul>
          {
            dadosResumo.slice(-1).map((res) => {
              return (
                <li key={res.id}>
                  <div>T O T A I S</div>
                  <div>
                    <b>Capítulo:</b>
                    <div>
                      <p>Total Receitas:</p>
                      <p>
                        R$ {toMoneyBr(res.totCre1)}
                      </p>
                    </div>
                    <div>
                      <p>Total Despesas:</p>
                      <p>
                        R$ {toMoneyBr(res.totDeb1)}
                      </p>
                    </div>
                    <div>
                      <p><i>Saldo do Mês:</i></p>
                      <p>
                        {(res.totCre1 - res.totDeb1) < 0 ? (
                          <span className="vlrNegativo">
                            <b>R$ {toMoneyBr(res.totCre1 - res.totDeb1)}</b></span>
                        ) : <span className="vlrPositivo"><b>R$ {toMoneyBr(res.totCre1 - res.totDeb1)}</b></span>}
                      </p>
                    </div>
                  </div>
                  <div>
                    <b>Solidariedade:</b>
                    <div>
                      <p>Total Receitas:</p>
                      <p>
                        R$ {toMoneyBr(res.totCre2)}
                      </p>
                    </div>
                    <div>
                      <p>Total Despesas:</p>
                      <p>
                        R$ {toMoneyBr(res.totDeb2)}
                      </p>
                    </div>
                    <div>
                      <p><i>Saldo do Mês:</i></p>
                      <p>
                        {(res.totCre2 - res.totDeb2) < 0 ? (
                          <span className="vlrNegativo">
                            <b>R$ {toMoneyBr(res.totCre2 - res.totDeb2)}</b></span>
                        ) : <span className="vlrPositivo"><b>R$ {toMoneyBr(res.totCre2 - res.totDeb2)}</b></span>}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className="posBotao">
        <button type="reset" onClick={onClose}>Fechar</button>
      </div>
    </>
  )
}