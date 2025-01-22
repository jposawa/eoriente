export const NOME_CAPITULO = 'Capítulo Charlotte Mendenhal';
export const CIDADE_CAPITULO = 'Fortaleza-CE';
export const URL_FOTOS_MEMBROS = 'https://datasystem-ce.com.br/eOriente/fotosMembros/';
export const URL_LOGIN = 'https://datasystem-ce.com.br/eOriente/api_eo_login.php';
export const URL_MEMBROS = 'https://datasystem-ce.com.br/eOriente/api_eo_membros.php';
export const URL_CAIXA = 'https://datasystem-ce.com.br/eOriente/api_eo_caixa.php';
export const URL_HISTORICO_PADRAO = "https://datasystem-ce.com.br/eOriente/api_eo_historico_padrao.php";
export const SITUACAO_MEMBROS = {
  ATIVO: "A",
  IRREGULARES: "I",
  FALECIDOS: "F"
}

export const TIT_LISTA_MEMBROS = {
  A: "Ativos",
  I: "Irregulares",
  F: "Falecidos"
}

export const PREFIXO = "eo";

export const MENSAGEM_ERRO = {
  LOGIN: "Favor efetuar login novamente",
};

export const AMBIENTE = process.env.REACT_APP_AMBIENTE ?? "test";