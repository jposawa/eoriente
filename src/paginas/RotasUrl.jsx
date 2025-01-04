import { Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { ListaMembros } from "./ListaMembros";
import { AlteraSenha } from "./AlteraSenha";
import { CadastraMembros } from "./CadastraMembros";
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