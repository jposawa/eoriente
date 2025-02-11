import { useRecoilValue } from "recoil"
import { usuarioLogadoAtom } from "../compartilhados/estados"
import { NOME_CAPITULO, CIDADE_CAPITULO, LOGO_CAPITULO, LOGO_POTENCIA } from "../compartilhados/constantes";

export const Cabecalho = (props) => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);

  if (!usuarioLogado) {
    return null;
  }
  return (
    <header className="cabecalho">
      <img src={LOGO_CAPITULO} />
      <div className="dadosCabecalho">
        <h3>{NOME_CAPITULO}</h3>
        <h6>{CIDADE_CAPITULO}</h6>
        <h5>{usuarioLogado.nome}</h5>
      </div>
      <img src={LOGO_POTENCIA} />
    </header>
  )
}