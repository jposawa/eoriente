import React from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/eoriente.png'
import PWABadge from './PWABadge.jsx'
import axios from 'axios'
import './App.css'
import { useRecoilValue } from 'recoil'
import { usuarioLogadoAtom } from './compartilhados/estados/index.jsx'
import { RotasUrl } from './paginas/RotasUrl.jsx'
import { Cabecalho, MenuPrincipal } from './componentes/'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

function App() {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const defineUsuarioLogado = useSetRecoilState(usuarioLogadoAtom);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!usuarioLogado) {
      const usuarioSessao = JSON.parse(sessionStorage.getItem('eo-dadosUsuario'))
      if (!usuarioSessao) {
        navigate('/login');
      }
      else {
        defineUsuarioLogado(usuarioSessao);
      }
    }
  }, [usuarioLogado]);
  const anoAtual = new Date().getFullYear();
  return (
    <main className='containerApp'>
      <div className='message'>
        <b>
          <p>Este aplicativo funciona melhor em</p>
          <p> modo retrato (na vertical).</p>
          <p>Favor rotacionar seu aparelho.</p>
        </b>
      </div>
      <Cabecalho className='cabecalho' />
      <section className='paginaCentral'>
        <RotasUrl />
      </section>
      <MenuPrincipal />
      <footer className='rodape'>&copy; Todos os Diteitos Reservados - {anoAtual}</footer>
    </main>
  )
}

export default App
