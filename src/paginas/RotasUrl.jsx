import { Route, Routes } from "react-router-dom";
import { Login } from "./Login.jsx";
import { ListaMembros } from "./ListaMembros.jsx";
import { AlteraSenha } from "./AlteraSenha.jsx";
import { CadastraMembros } from "./CadastraMembros.jsx";
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
      <Route path="cadastramembros/:id" element = {
        <CadastraMembros/>
      } />
      <Route path="cadastramembros" element = {
        <CadastraMembros/>
      } />
      <Route path="/" exact element = {
        <ListaMembros/>
      } />
    </Routes>
  )
}
