import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AMBIENTE, URL_HISTORICO_PADRAO } from "../compartilhados/constantes";

export const CadastraLancamentoPadrao = (props) => {
  const { onClose, dados } = props;
  const [carregou, setCarregou] = React.useState(true);
  const [id, setId] = React.useState(0);
  const [status, setStatus] = React.useState('');
  if (carregou) {
    if (dados.id > 0) {
      setId(dados.id);
      setStatus(dados.status);
      setCarregou(false);
    }
  };

  const cadAltLancPadrao = (dadosInputs) => {
    dadosInputs.preventDefault(); // para nao dar o refresh
    const { target } = dadosInputs; // pegar os inputs
    const novosDados = {}; // para Inputs(name) com mesmo nome dos campos do BD
    Object.keys(target).forEach((indiceForm) => {
      const chaveForm = target[indiceForm].name;
      if (!!chaveForm) {
        const valorForm = target[indiceForm].value;
        novosDados[chaveForm] = valorForm;
      }
    })
    if (novosDados.id > 0) { // faz alteracao, senao salva novo membro
      axios.put(URL_HISTORICO_PADRAO, {
        ...novosDados,
        status: status
      }).then((resposta) => {
        toast.success(resposta.data);
        fechaModalLancPadroes();
        window.location.reload();
      }).catch((erro) => {
        toast.warn(erro?.data);
      })
    }
    else {
      axios.post(URL_HISTORICO_PADRAO, {
        ...novosDados,
        status: status,
        ambiente: AMBIENTE
      }).then((resposta) => {
        toast.success(resposta.data);
        fechaModalLancPadroes();
        window.location.reload();
      }).catch((erro) => {
        toast.error(erro.data);
      })
    }
  }
  const fechaModalLancPadroes = () => {
    onClose();
  }

  return (
    <>
      <div className='titCadastroLancPadroes'>
        <h3>Cadastra Lançamento</h3>
      </div>
      <div className='containerFormCadLancPadroes'>
        <form onSubmit={cadAltLancPadrao}>
          <p>Novo Lançamento Padrão:
          <input name="id" type="hidden" defaultValue={dados?.id}/>
          </p>
          <p>
            <input name="historico" type="text" size="45" maxLength={50} defaultValue={dados?.historico} required />
          </p>
          <p>Tipo:
            <p>Débito:
              <input name="status" type="radio" defaultValue={dados?.status} checked={status == 'D'} onChange={() => {
                setStatus('D');
              }} required />
            </p>
            <p>Crédito:
              <input name="status" type="radio" defaultValue={dados?.status} checked={status == 'C'} onChange={() => {
                setStatus('C');
              }} required />
            </p>
          </p>
          <div>
            <button type="reset" onClick={() => { fechaModalLancPadroes() }} >Cancelar</button>
            <button type="submit" >Salvar</button>
          </div>
        </form>
      </div>
    </>
  )
}