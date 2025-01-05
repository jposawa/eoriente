import { atom } from "recoil";
import { SITUACAO_MEMBROS } from "../constantes";

export const usuarioLogadoAtom = atom({
  key:'estrela-usuario',
  default: null
})
export const situacaoMembroAtom = atom({
  key:'estrela-situacaoMembro',
  default: SITUACAO_MEMBROS.ATIVO,
})