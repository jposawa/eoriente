import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { situacaoMembroAtom, usuarioLogadoAtom } from "../compartilhados/estados"
import './ListaMembros.css'
import { CameraOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { AMBIENTE, TIT_LISTA_MEMBROS, URL_FOTOS_MEMBROS, URL_MEMBROS } from "../compartilhados/constantes";
import { Popconfirm } from "antd";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { EnviaFotoMembro, Modal } from "../componentes/";
import { dataDoBanco } from "../compartilhados/funcoes";

export const ListaMembros = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  /*const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);*/
  const [carregando, defineCarregando] = React.useState(false);
  const [listaMembros, defineListaMembros] = React.useState([]);
  const filtro = useRecoilValue(situacaoMembroAtom);
  
  const confirmarExclusao = (id) => {
    axios.delete(URL_MEMBROS.concat("/",id)
    ).then(() => {
      //console.log(resposta.data);
      toast.warn('Exclusão realizada com sucesso !');
      buscarMembros();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
      console.error('Erro no acesso:', erro);
    })
  }
  const buscarMembros = () => {
    defineCarregando(true);
    axios.get(URL_MEMBROS, {
      params: {
        ambiente: AMBIENTE,
      }
    }).then((resposta) => {
      /*dadosMembros(resposta.data);*/
      //console.log(resposta.data);
      defineListaMembros(resposta.data);
    }).catch((erro) => {
      toast.error("Erro na requisição, verifique sua conexão.")
      console.error('Erro no acesso:', erro);
    }).finally(() => {
      defineCarregando(false);
    })
  }

  const buscaImagemVazia = (event) => {
    event.target.src = `${URL_FOTOS_MEMBROS}f000.jpg`;
  }

  const [modalEnviaFotoMembroAberto, defineModalEnviaFotoMembroAberto] = React.useState(null);
  const fechaModalEnviaFotoMembro = () => {
    defineModalEnviaFotoMembroAberto(false);
  }
  React.useEffect(() => {
    if (!carregando && listaMembros.length === 0) {
      buscarMembros();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3 className="tituloListaMembros">Lista de Membros {TIT_LISTA_MEMBROS[filtro]}
      </h3>
      <ul className="listaMembros">
        {
          listaMembros.filter((membro) => {
            return (membro.situacao === filtro);
          }).map((membro) => {
            return (
              <li key={membro.id}>
                <div className="fotoMembro">
                  <img src={`${URL_FOTOS_MEMBROS}${membro.arquivoFoto}`} onError={buscaImagemVazia} />
                </div>
                <div className="conteudo">
                  <p>
                    <b>{membro.cadastro} - {membro.nome}</b>
                  </p>
                  <p>
                    Iniciação: {dataDoBanco(membro.dataIniciacao)}
                  </p>
                  <p>
                    {membro.logradouro}
                  </p>
                  <p>
                    {membro?.bairro.length > 0 ? (`${membro.bairro} - `) : null} 
                    {membro.cidade}
                  </p>
                  <p>
                    <b>{membro.telCelular} {membro.telResidencial}</b>
                  </p>
                  {usuarioLogado?.nivelAcesso > 3 ? (// é um return
                    <div className="btsAcoes">
                      <Popconfirm
                        title="Excluir Registro"
                        description="Confirma a exclusão deste registro ?"
                        onConfirm={() => {
                          confirmarExclusao(membro.id)
                        }}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <button type="button">
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                      <button type="button" onClick={() => {
                        defineModalEnviaFotoMembroAberto({ cad: membro.cadastro, nome: membro.nome, arqFoto: membro.arquivoFoto })
                      }
                      }>
                        <CameraOutlined />
                      </button>
                      <button type="button">
                        <Link to={`/cadastramembros/${membro.id}`}>
                          <FormOutlined />
                        </Link>
                      </button>
                    </div>
                  )
                    : null}
                </div>
              </li>
            )
          })
        }
      </ul>
      <Modal
        className="modalPrincipal modalEnviaFotoMembro"
        open={!!modalEnviaFotoMembroAberto}
        onClose={fechaModalEnviaFotoMembro}
      >
        <EnviaFotoMembro carregaLista={buscarMembros} dadosMembro={modalEnviaFotoMembroAberto} onClose={fechaModalEnviaFotoMembro} />
      </Modal>
    </>
  )
}