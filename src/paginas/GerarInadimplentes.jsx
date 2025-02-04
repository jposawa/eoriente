import React from "react";
import './TransparenciaFinanceira.css';
import axios from "axios";
import { AMBIENTE, URL_CAIXA } from "../compartilhados/constantes";

export const GerarInadimplentes = (props) => {
 const { onClose } = props;
  const [dadosInadimplentes, setDadosInadimplentes] = React.useState([]);
  React.useEffect(() => {
    buscarDadosInadimplentes();
  }, []);

  const buscarDadosInadimplentes = () => {
    axios.get(URL_CAIXA, {
      params: {
        opc: 'inadimplentes',
        ambiente: AMBIENTE
      }
    })
      .then(response => {
        setDadosInadimplentes(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
    }

    return (
        <>
        <div className="modalInadimplentes">
            <div className="titInadimplentes">
                <h3>Relação dos Inadimlentes</h3>
            </div>
            <div className="cabInadimplentes">
                <p>
                    Nome
                </p>
                <p>
                    ult.Mês Pago
                </p>
                <p>
                    Quant. Atrasada
                </p>
            </div>
            <div className="containerInadimplentes">
                <p>
                nome kdjlsk sdlkfjs sldkjfs lskdjf jkjkjk
                </p>
                <p>
                    11/2024
                </p>
                <p>
                    02
                </p>
            </div>
            <div>
                <button type="reset" className="bt_fecharInadimplentes"
                onClick={onClose}>
                Fechar
                </button>
            </div>
        </div>
        </>
    )
}