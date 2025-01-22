import React from "react";
import './ResumoCaixaMes.css';
import axios from "axios";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";

export const ResumoCaixaMes = (props) => {
  const { onClose, mesAnoSel } = props;
  const [loading, setLoading] = React.useState(false);

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
        //console.log(response.data);
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
                <li key={res.chave}>
                  <p>
                    {res}
                  </p>
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