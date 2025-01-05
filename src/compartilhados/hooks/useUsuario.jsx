import React from "react";

import { useRecoilValue } from "recoil";
import { usuarioLogadoAtom } from "../estados/";

export const useUsuario = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);

  /**
   * Retorna true ou false dependendo se existe usuarioLogado
   *
   * @returns {boolean}
   */
  const existeSessao = React.useMemo(() => {
    return !!usuarioLogado;
  }, [usuarioLogado]);

  return {
    existeSessao,
  }
}
