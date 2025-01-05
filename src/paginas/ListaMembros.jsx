import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil"
import { situacaoMembroAtom, usuarioLogadoAtom } from "../compartilhados/estados"
import './ListaMembros.css'
import { CameraOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { URL_FOTOS_MEMBROS } from "../compartilhados/constantes";
import { Popconfirm } from "antd";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { EnviaFotoMembro, Modal } from "../componentes/";

export const ListaMembros = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  /*const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);*/
  const [carregando, defineCarregando] = React.useState(false);
  const [listaMembros, defineListaMembros] = React.useState([]);
  const filtro = useRecoilValue(situacaoMembroAtom);

  const confirmarExclusao = (id) => {
    axios.delete(`https://datasystem-ce.com.br/eOriente/api_eo_membros.php/${id}`).then((resposta) => {
      //console.log(resposta.data);
      toast.warn('Exclusão realizada com sucesso !');
      buscarMembros();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
      //console.error('Erro no acesso:', erro);
    })
  }
  const buscarMembros = () => {
    defineCarregando(true);
    axios.get('https://datasystem-ce.com.br/eOriente/api_eo_membros.php').then((resposta) => {
      /*dadosMembros(resposta.data);*/
      //console.log(resposta.data);
      defineListaMembros(resposta.data);
    }).catch((erro) => {
      toast.error("Erro na requisição, verifique sua conexão.")
      //console.error('Erro no acesso:', erro);
    }).finally(() => {
      defineCarregando(false);
    })
  }

  const [modalEnviaFotoMembroAberto, defineModalEnviaFotoMembroAberto] = React.useState(null);
  const alternaModalEnviaFotoMembroAberto = () => {
    defineModalEnviaFotoMembroAberto(!modalEnviaFotoMembroAberto);
  }
  const fechaModalEnviaFotoMembro = () => {
    defineModalEnviaFotoMembroAberto(false);
  }
  React.useEffect(() => {
    if (!carregando && listaMembros.length === 0) {
      buscarMembros();
    }
  }, []);

  return (
    <>
      <h3 className="tituloListaMembros">Lista de Membros</h3>
      <ul className="listaMembros">
        {
          listaMembros.filter((membro) => {
            return (membro.situacao === filtro);
          }).map((membro) => {
            return (
              <li key={membro.id}>
                <div className="fotoMembro">
                  <img src={`${URL_FOTOS_MEMBROS}${membro.arquivoFoto}`} />
                </div>
                <div className="conteudo">
                  <p>
                    Cadastro:<b> {membro.cadastro}</b>
                  </p>
                  <p>
                    <b>{membro.nome}</b>
                  </p>
                  <p>
                    {membro.logradouro}
                  </p>
                  <p>
                    {membro.bairro} - {membro.cidade}
                  </p>
                  <p>
                    {membro.telCelular} {membro.telResidencial}
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
                        defineModalEnviaFotoMembroAberto({cad:membro.cadastro, nome:membro.nome, arqFoto:membro.arquivoFoto})
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
        className="modalAlteraSenha modalEnviaFotoMembro"
        open={!!modalEnviaFotoMembroAberto}
        onClose={fechaModalEnviaFotoMembro}
      >
        <EnviaFotoMembro carregaLista={buscarMembros} dadosMembro={modalEnviaFotoMembroAberto} onClose={fechaModalEnviaFotoMembro} />
      </Modal>
    </>
  )
}