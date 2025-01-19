import React from "react"
import { Modal } from "./Modal"
import { useRecoilState } from "recoil"
import { situacaoMembroAtom, usuarioLogadoAtom } from "../compartilhados/estados"
import './MenuPrincipal.css'
import { Link } from 'react-router-dom'
import { AuditOutlined, DollarOutlined, EditOutlined, FileExcelOutlined, LogoutOutlined, StarOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { AlteraSenha } from "../paginas/AlteraSenha";
import { SITUACAO_MEMBROS } from "../compartilhados/constantes"
import { Popconfirm } from "antd"

export const MenuPrincipal = () => {
  const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);
  const [filtro, setFiltro] = useRecoilState(situacaoMembroAtom);

  const logout = () => {
    sessionStorage.removeItem('eo-dadosUsuario');
    defineUsuarioLogado(null);
  }

  const [modalAlteraSenhaAberto, defineModalAlteraSenhaAberto] = React.useState(false);
  const alternaModalAlteraSenhaAberto = () => {
    defineModalAlteraSenhaAberto(!modalAlteraSenhaAberto);
  }

  const fechaModal = () => {
    defineModalAlteraSenhaAberto(false);
  }
  const atualizaFiltro = (novoFiltro) => {
    if (novoFiltro === filtro) {
      setFiltro(SITUACAO_MEMBROS.ATIVO)
    } else {
      setFiltro(novoFiltro);
    }
  }
  if (!usuarioLogado) {
    return null;
  }
  return (
    <>
      <nav className="menuPrincipal">
        {usuarioLogado?.nivelAcesso > 3 ? (  // é um return
          <>
            <li>
              <Link to='cadastramembros'>
                <UsergroupAddOutlined />
                <p>Cadastra Membros</p>
              </Link>
            </li>
            <li onClick={() => {
              atualizaFiltro(SITUACAO_MEMBROS.IRREGULARES);
            }}>
              {filtro !== SITUACAO_MEMBROS.IRREGULARES ? (
                <>
                  <FileExcelOutlined />
                  <p>Irregulares</p>
                </>
              ) : (
                <>
                  <UsergroupAddOutlined />
                  <p>Ativos</p>
                </>
              )}
            </li>
            <li onClick={() => {
              atualizaFiltro(SITUACAO_MEMBROS.FALECIDOS);
            }}>
              {filtro !== SITUACAO_MEMBROS.FALECIDOS ? (
                <>
                  <StarOutlined />
                  <p>Falecidos</p>
                </>
              ) : (
                <>
                  <UsergroupAddOutlined />
                  <p>Ativos</p>
                </>
              )}
            </li>
          </>
        )
          : null}
        <li>
          <AuditOutlined />
          <p>Minhas Mensalidades</p>
        </li> 
        <li>      
          <Link to='transparenciafinanceira'>
            <DollarOutlined />
            <p>Transparência Financeira</p>
          </Link>
        </li>
        <li onClick={alternaModalAlteraSenhaAberto}>
          <EditOutlined />
          <p>Altera Senha</p>
        </li>
        <li>
          <Popconfirm
            title="Sair"
            description="Confirma desconectar do aplicativo ?"
            onConfirm={() => {
              logout();
            }}
            okText="Sim"
            cancelText="Não"
          >
            <LogoutOutlined />
            <p>Desconectar</p>
          </Popconfirm>
        </li>
      </nav>
      <Modal
        className="modalPrincipal"
        open={modalAlteraSenhaAberto}
        onClose={fechaModal}
      >
        <AlteraSenha onClose={fechaModal} />
      </Modal>
    </>
  )
}