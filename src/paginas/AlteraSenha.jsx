import React from "react"
import axios from 'axios'
import './AlteraSenha.css'
import { toast } from 'react-toastify'
import { useRecoilValue } from "recoil";
import { usuarioLogadoAtom } from "../compartilhados/estados"

export const AlteraSenha = (props) => {
  const { onClose } = props;
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const efetuarAlteracao = (event) => {
    event.preventDefault(); // para nao dar o refresh
    const { target } = event; // pegar os inputs
    const valorSenha = target.senhaAlterar.value; // pega os valores inputs
    const senhaRedigitada = target.senhaRedigitada.value;
    if (valorSenha === senhaRedigitada) {
      axios.patch(`https://datasystem-ce.com.br/eOriente/api_eo_membros.php/${usuarioLogado.id}`, { valorSenha }).then((resposta) => {
        toast.success("Senha alterada com sucesso !");
        /*console.log(resposta.data);*/
        onClose();
      }).catch((erro) => {
        toast.error("Senha não alterada. Verifique sua conexão !");
        /*console.error('Erro no acesso:', erro);*/
      })
    }
    else {
      toast.warn('Senhas digitadas não conferem...')
    }
  }
  return (
    <>
      <div className='tituloAlteraSenha'>
        <h3>Alterando Senha</h3>
      </div>
      <div className='containerFormAlteraSenha'>
        <form className='form' onSubmit={efetuarAlteracao}>
          <div className='containerInput'>

            <p>Nova senha:
              <input type="password" name="senhaAlterar" required />
            </p>
            <p>Redigite a nova senha:
              <input type="password" name="senhaRedigitada" required />
            </p>
          </div>
          <section>
            <button className='bt_cancelar' type="reset" onClick={() => { onClose() }} >Cancelar</button>
            <button className='bt_alterar' type="submit" >Alterar</button>
          </section>
        </form>
      </div>
    </>
  )
}
