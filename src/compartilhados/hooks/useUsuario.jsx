import React from "react";

import { usuarioLogadoAtom } from "../estados/";
import { useNavigate } from "react-router-dom";
import { comPrefixo } from "../funcoes";
import { useRecoilState } from "recoil";

/**
 * Hook para gerenciar acesso de usuários
 */
export const useUsuario = () => {
  const [usuarioLogado, setUsuarioLogado] = useRecoilState(usuarioLogadoAtom);
  const navigate = useNavigate();

  /**
   * DIFERENÇA ENTRE useEffect, useMemo e useCallback:
   * Os três efetuam a função interna quando pelo menos 1 dos elementos do array de dependência tem seu valor alterado
   *
   * O @useEffect não retorna nenhum valor
   *
   * O @useMemo pode retornar valor para uma variável
   *
   * O @useCallback cria uma função para ser reutilizada
   */

  /**
   * Retorna true ou false dependendo se existe usuarioLogado
   *
   * @returns {boolean}
   */
  const existeSessao = React.useMemo(() => {
    return !!usuarioLogado;
  }, [usuarioLogado]);

  /**
   * Verifica se existe usuário logado e se ele tem permissão para acessar essa página
   * Caso negativo, redireciona para a página de login ou, caso esteja logado, lista membros
   *
   * @param {1 | 2 | 3 | 4} [nivelRequerido=1] Nível de acesso que usuário precisa ter para acessar essa página
   *
   * @returns {void}
   */
  const redirecionaAcessoRestrito = React.useCallback((nivelRequerido = 1) => {
    if (!usuarioLogado) {
      const usuarioSessao = JSON.parse(sessionStorage.getItem(comPrefixo("dadosUsuario")));

      if (usuarioSessao) {
        setUsuarioLogado(usuarioSessao);
      } else {
        navigate("/login");
      }
    } else if (usuarioLogado.nivelAcesso < nivelRequerido) {
      navigate("/listamembros");
    }
  }, [navigate, setUsuarioLogado, usuarioLogado])

  return {
    existeSessao,
    redirecionaAcessoRestrito,
  }
}
