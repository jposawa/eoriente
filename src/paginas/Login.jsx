import React from 'react'
import axios from 'axios'
import './Login.css'
import { usuarioLogadoAtom } from '../compartilhados/estados/'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { AMBIENTE, CIDADE_CAPITULO, NOME_CAPITULO } from '../compartilhados/constantes'
import { useRecoilValue } from 'recoil'

export const Login = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const defineUsuarioLogado = useSetRecoilState(usuarioLogadoAtom)
  const navigate = useNavigate();

  const efetuarAcesso = (event) => {
    event.preventDefault(); // para nao dar o refresh
    const { target } = event; // pegar os inputs
    const valorcadastro = target.cadastro.value; // pega os valores inputs
    const valorsenha = target.senha.value;
    axios.get('https://datasystem-ce.com.br/eOriente/api_eo_login.php', {
      params: { // para POST nao precisa do 'params'
        login: valorcadastro,
        senha: valorsenha,
        ambiente: AMBIENTE,
      }
    }).then((resposta) => {
      defineUsuarioLogado(resposta.data)
      sessionStorage.setItem('eo-dadosUsuario', JSON.stringify(resposta.data));
      navigate('/listamembros');
    }).catch((erro) => {
      toast.error("Cadastro ou senha inválida !")
      console.error('Erro no acesso:', erro);
    })
  }
  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('eo-dadosUsuario'))
    if (usuarioLogado || usuarioSessao) {
      navigate('/listamembros');
    }
  }, []);
  return (
    <>
      <div className='tituloLogin'>
        <p className='logo'><img src="img/logo.jpg" /></p>
        <h3>{NOME_CAPITULO}</h3>
        <h4>{CIDADE_CAPITULO}</h4>
      </div>
      <div className='containerForm'>
        <form className='formLogin' onSubmit={efetuarAcesso}>
          <div className='containerInputsLogin'>
            <div>
              <p>Cadastro</p>
              <input type="tel" name="cadastro" maxLength="6" required />
            </div>
            <label>
              <p>Senha</p>
              <input type="password" name="senha" required />
            </label>
          </div>
          <div>
            <button className='bt_acessar' type="submit">Acessar</button>
          </div>
        </form>
      </div>
    </>
  )
}
