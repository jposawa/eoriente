import { Route, Routes } from "react-router-dom";
import { Login } from "./Login.jsx";
import { ListaMembros } from "./ListaMembros.jsx";
import { AlteraSenha } from "./AlteraSenha.jsx";
import { LancamentoCaixa } from "./LancamentoCaixa.jsx";
import { CadastraMembros } from "./CadastraMembros.jsx";
import { TransparenciaFinanceira } from "./TransparenciaFinanceira.jsx";
import { LancamentosPadroes } from "./LancamentosPadroes.jsx";
import { ResumoCaixaMes } from "./ResumoCaixaMes.jsx";
export const RotasUrl = () => {
  return(
    <Routes>
      <Route path="login" element = {
        <Login/>
      } />
      <Route path="listamembros" element = {
        <ListaMembros/>
      } />
      <Route path="alterasenha" element = {
        <AlteraSenha/>
      } />
      <Route path="lancamentocaixa" element = {
        <LancamentoCaixa/>
      } />
      <Route path="cadastramembros/:id" element = {
        <CadastraMembros/>
      } />
      <Route path="cadastramembros" element = {
        <CadastraMembros/>
      } />
      <Route path="transparenciafinanceira" element = {
        <TransparenciaFinanceira/>
      } />
      <Route path="lancamentospadroes" element = {
        <LancamentosPadroes/>
      } />
      <Route path="resumocaixames" element = {
        <ResumoCaixaMes/>
      } />
      <Route path="/" exact element = {
        <ListaMembros/>
      } />
    </Routes>
  )
}
