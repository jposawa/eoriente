import { PREFIXO } from "../constantes"

export const comPrefixo = (textoBase, prefixo = PREFIXO) => {
  return `${prefixo}-${textoBase}`;
}