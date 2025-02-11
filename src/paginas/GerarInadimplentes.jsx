import React from "react";
import './TransparenciaFinanceira.css';
import axios from "axios";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";

export const GerarInadimplentes = (props) => {
  const { onClose } = props;
  const [dadosInadimplentes, setDadosInadimplentes] = React.useState([]);
  React.useEffect(() => {
    
    axios.get(URL_CAIXA, {
      params: {
        opc: 'inadimplentes',
        ambiente: AMBIENTE
      }
    })
      .then(response => {
        setDadosInadimplentes(response.data);
        console.log(response.data);
        console.log('Teste');
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });

  }, []);

  return (
      <>
        <div className="titInadimplentes">
            <h3>Relação dos Inadimplentes</h3>
        </div>
        <div className="cabInadimplentes">
            <p>
                Nome
            </p>
            <p>
                Ult.Mês Pago
            </p>
            <p>
                Quant. Atrasada
            </p>
        </div>
        <ul>
          {
            dadosInadimplentes.length > 0 ? (
              dadosInadimplentes.map((dados) => {
              return (
                <li key={dados.id}>
                  <div>
                    <p>
                      {dados.nome}
                    </p>
                    <p>
                      {dados.mesAno}
                    </p>
                    <p>
                      {dados.qtdAtrasada}
                    </p>
                  </div>
                </li>
              )
              })
            ) : <span><div>Parabéns.</div><div>Nenhuma Indimplência encontrada !!!</div></span>
          }
        </ul>
        <div>
            <button type="reset" className="bt_fecharInadimplentes"
            onClick={onClose}>
            Fechar
            </button>
        </div>
      </>
  )
}