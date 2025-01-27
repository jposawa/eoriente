import React from "react";
import './LancamentosPadroes.css';
import { DeleteOutlined, FormOutlined, OrderedListOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CadastraLancamentoPadrao } from "./CadastraLancamentoPadrao";
import { Modal } from "../componentes";
import axios from "axios";
import { AMBIENTE, URL_CAIXA, URL_HISTORICO_PADRAO } from "../compartilhados/constantes";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";

export const LancamentosPadroes = () => {
  // para Modal manutenção dos laçamentos padrões
  const [modalLancPadroes, setModalLancPadroes] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const alternaModalManutLancPadroes = () => {
    setModalLancPadroes(!modalLancPadroes);
  }
  const [dadosLancPad, setDadosLancPad] = React.useState([]);

  const buscarLancPadroes = () => {
    setLoading(true);
    axios.get(URL_CAIXA, {
      params: {
        opc: 'buscaHistoricoPadrao',
        ambiente: AMBIENTE
      }
    })
      .then(response => {
        setDadosLancPad(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };
  const excluirLancPadrao = (id) => {
    axios.delete(URL_HISTORICO_PADRAO.concat("/", id)
    ).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarLancPadroes();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }
  const fechaModalLancPadroes = () => {
    setModalLancPadroes(false);
  }

  React.useEffect(() => {
    if (!loading && dadosLancPad.length === 0) {
      buscarLancPadroes();
    }
  }, []);
  return (
    <>
      <div className="titManutLancPadroes"><h3>Lançamentos Padrões</h3></div>
      <div className="cabManutLancPadroes">
        <p>Lançamento Padrão</p>
        <p>Tipo</p>
      </div>
      <ul className="containerLancPadroes">
        {
          dadosLancPad.map((opc) => {
            return (
              <li key={opc.idHistorico}>
                <p>
                  {opc.historicoPadrao}
                </p>
                <p>
                  {opc.status}
                </p>
                <p>
                  {opc?.idHistorico > 1 ? (
                    <Popconfirm
                      title="Excluir Lançamento"
                      description="Confirma exclusão ?"
                      onConfirm={() => {
                        excluirLancPadrao(opc.idHistorico)
                      }}
                      okText="Sim"
                      cancelText="Não"
                    >
                      <button type="button">
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  ) : null}
                </p>
                <p>
                  {opc?.idHistorico > 1 ? (
                    <button type="button" onClick={() => {
                      setModalLancPadroes({ id: opc.idHistorico, historico: opc.historicoPadrao, status: opc.status })
                    }
                    }>
                      <FormOutlined />
                    </button>
                  ) : null}
                </p>
              </li>
            )
          })
        }
      </ul>
      <nav className="menuManutLancPadroes">
        <li onClick={alternaModalManutLancPadroes}>
          <OrderedListOutlined />
          <p>Cadastrar</p>
        </li>
        <li>
          <Link to='../transparenciafinanceira'>
            <RollbackOutlined />
            <p>Retornar</p>
          </Link>
        </li>
      </nav>
      <Modal
        className="modalPrincipal modalLancPadroes"
        open={!!modalLancPadroes}
        onClose={fechaModalLancPadroes}
      >
        <CadastraLancamentoPadrao onClose={fechaModalLancPadroes} dados={modalLancPadroes} />
      </Modal>
    </>
  )
}