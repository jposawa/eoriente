import './App.css'

function App() {

  screen.orientation.lock("portrait");

  return (
    <main className="appContainer">
      <iframe className="appFrame" src="https://datasystem-ce.com.br/eOriente/eOriente.php"/>
    </main>
  )
}

export default App
