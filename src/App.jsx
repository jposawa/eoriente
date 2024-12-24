import reactLogo from './assets/react.svg'
import appLogo from '/eoriente.png'
import PWABadge from './PWABadge.jsx'
import './App.css'
import { Contador } from './components/index.js'

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="logo" alt="estrela-oriente logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>estrela-oriente</h1>
      <div className="card">
        <Contador />
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
    </>
  )
}

export default App
