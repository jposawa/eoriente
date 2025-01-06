/* eslint-disable no-extra-boolean-cast */
import React from "react";
import './CadastraMembros.css'
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../componentes";
import axios from "axios";
import { toast } from "react-toastify";
import { useUsuario } from "../compartilhados/hooks";
import { MENSAGEM_ERRO } from "../compartilhados/constantes";
import { formatarCep, formatarCPF, formatarTelefone } from "../compartilhados/funcoes";

export const CadastraMembros = () => {
  const { id } = useParams();
  const [dadosMembro, defineDadosMembro] = React.useState();
  const [vinculoMaconico, defineVinculoMaconico] = React.useState('');
  const navigate = useNavigate();
  const { existeSessao, redirecionaAcessoRestrito } = useUsuario();

  const [radioValueDoadorSangue, setRadioValueDoadorSangue] = React.useState('');
  const radioDoadorSangue = (ev) => {
    //console.log(ev.target.value);
    setRadioValueDoadorSangue(ev.target.value);
  }

  const [radioValueTipoSanguineo, setRadioValueTipoSanguineo] = React.useState('');
  const radioTipoSanguineo = (ev) => {
    //console.log(ev.target.value);
    setRadioValueTipoSanguineo(ev.target.value);
  }

  const [radioValueNivelAcesso, setRadioValueNivelAcesso] = React.useState('1');
  const radioNivelAcesso = (ev) => {
    //console.log(ev.target.value);
    setRadioValueNivelAcesso(ev.target.value);
  }

  const [radioValueSituacao, setRadioValueSituacao] = React.useState('A');
  const radioSituacao = (ev) => {
    //console.log(ev.target.value);
    setRadioValueSituacao(ev.target.value);
  }
  React.useEffect(() => {
    redirecionaAcessoRestrito();

    if (id) {
      axios.get(`https://datasystem-ce.com.br/eOriente/api_eo_membros.php?id=${id}`).then((resposta) => {
        defineDadosMembro(resposta.data);
        defineVinculoMaconico(resposta.data.parentescoMaconico);
        setRadioValueDoadorSangue(resposta.data.doadorSangue);
        setRadioValueTipoSanguineo(resposta.data.tipoSanguineo);
        setRadioValueNivelAcesso(resposta.data.nivelAcesso);
        setRadioValueSituacao(resposta.data.situacao)
      }).catch(() => {
        toast.error("Erro na requisição, verifique sua conexão.")
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cadAltMembro = (dados) => {
    dados.preventDefault(); // para nao dar o refresh
    if (!existeSessao) {
      toast.error(MENSAGEM_ERRO);
      return;
    }

    const { target } = dados; // pegar os inputs
    const novosDados = {}; // para Inputs(name) com mesmo nome dos campos do BD
    Object.keys(target).forEach((indiceForm) => {
      const chaveForm = target[indiceForm].name;
      if (!!chaveForm) {
        const valorForm = target[indiceForm].value;
        novosDados[chaveForm] = valorForm;
      }
    })

    if (id) { // faz alteracao, senao salva novo membro
      axios.put(`https://datasystem-ce.com.br/eOriente/api_eo_membros.php/${id}`, {
        ...novosDados,
        doadorSangue: radioValueDoadorSangue,
        tipoSanguineo: radioValueTipoSanguineo,
        parentescoMaconico: vinculoMaconico,
        nivelAcesso: radioValueNivelAcesso,
        situacao: radioValueSituacao
      }).then((resposta) => {
        toast.success(resposta.data);
        //  console.log(resposta.data);
        navigate('/listamembros');
      }).catch((erro) => {
        toast.warn(erro?.data);
        //  console.log(resposta.data);
      })
    }
    else {
      axios.post("https://datasystem-ce.com.br/eOriente/api_eo_membros.php", {
        ...novosDados,
        doadorSangue: radioValueDoadorSangue,
        tipoSanguineo: radioValueTipoSanguineo,
        parentescoMaconico: vinculoMaconico,
        nivelAcesso: radioValueNivelAcesso,
        situacao: radioValueSituacao
      }).then((resposta) => {
        toast.success(resposta.data);
        //  console.log(resposta.data);
        navigate('/listamembros');
      }).catch((erro) => {
        toast.warn(erro.data);
        //  console.log(resposta.data);
      })
    }
  }

  return (
    <>
      <h3 className="tituloCadMembro">Cadastro de Membros</h3>
      <form className='formCadMembro' onSubmit={cadAltMembro}>
        <div className="corpoCadMembro">
          <h4 className="subTituloCadMembro">Dados Pessoais</h4>
          <p>
            <Input name="cadastro" type="tel" size="6" defaultValue={dadosMembro?.cadastro} label="Cadastro:" required />
          </p>
          <p>
            <Input name="nome" type="text" size="35" defaultValue={dadosMembro?.nome} label="Nome:" required />
          </p>
          <p>
            <Input name="conhecidoPor" type="text" size="20" defaultValue={dadosMembro?.conhecidoPor} label="Conhecido(a) por:" />
          </p>
          <p>
            <Input name="dataIniciacao" type="date" defaultValue={dadosMembro?.dataIniciacao} label="Data da Iniciação:" required />
          </p>
          <p>
            <Input name="lojaPatrocinadora" type="text" size="35" defaultValue={dadosMembro?.lojaPatrocinadora} label="Loja Patrocinadora:" />
          </p>
          <p>
            <Input name="numLoja" type="tel" size="3" defaultValue={dadosMembro?.numLoja} label="Nº Loja:" />
          </p>
          <p>
            <Input name="orienteLojaPatrocinadora" type="text" size="25" defaultValue={dadosMembro?.orienteLojaPatrocinadora} label="Cidade Loja Patrocinadora:" />
          </p>
          <p>
            <Input name="dataNasc" type="date" defaultValue={dadosMembro?.dataNasc} label="Data Nascimento:" />
          </p>
          <p>
            <Input name="naturalidade" type="text" size="25" defaultValue={dadosMembro?.naturalidade} label="Naturalidade:" />
          </p>
          <span>
            <p>
              Doador de Sangue:
            </p>
            <p>
              <Input name="doadorSangue" type="radio" defaultValue={dadosMembro?.doadorSangue} label="Sim" checked={radioValueDoadorSangue === 'S'} value='S' onChange={radioDoadorSangue} />
            </p>
            <p>
              <Input name="doadorSangue" type="radio" defaultValue={dadosMembro?.doadorSangue} label="Não" checked={radioValueDoadorSangue === 'N'} value='N' onChange={radioDoadorSangue} />
            </p>
          </span>
          <p>
            Tipo Sanguíneo:
          </p>
          <span>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="A+" checked={radioValueTipoSanguineo === 'A+'} value='A+' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="A-" checked={radioValueTipoSanguineo === 'A-'} value='A-' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="B+" checked={radioValueTipoSanguineo === 'B+'} value='B+' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="B-" checked={radioValueTipoSanguineo === 'B-'} value='B-' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="AB+" checked={radioValueTipoSanguineo === 'AB+'} value='AB+' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="AB-" checked={radioValueTipoSanguineo === 'AB-'} value='AB-' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="O+" checked={radioValueTipoSanguineo === 'O+'} value='O+' onChange={radioTipoSanguineo} />
            </p>
            <p>
              <Input name="tipoSanguineo" type="radio" defaultValue={dadosMembro?.tipoSanguineo} label="O-" checked={radioValueTipoSanguineo === 'O-'} value='O-' onChange={radioTipoSanguineo} />
            </p>
          </span>
          <p>
            <Input name="rg" type="tel" defaultValue={dadosMembro?.rg} label="RG" />
          </p>
          <p>
            <Input name="orgaoEmissor" type="text" size="8" defaultValue={dadosMembro?.orgaoEmissor} label="Orgão Emissor:" />
          </p>
          <p>
            <Input name="cpf" type="tel" size="16" defaultValue={dadosMembro?.cpf} label="CPF:" onChange={formatarCPF} />
          </p>
          <p>
            <Input name="email" type="email" size="35" defaultValue={dadosMembro?.email} label="E-mail:" />
          </p>
          <p>
            <Input name="telCelular" type="tel" size="16" defaultValue={dadosMembro?.telCelular} label="Celular:" onChange={formatarTelefone} required />
          </p>
          <p>
            <Input name="telComercial" type="tel" size="16" defaultValue={dadosMembro?.telComercial} label="Tel.Comercial:" onChange={formatarTelefone} />
          </p>
          <p>
            <Input name="nomePai" type="text" size="35" defaultValue={dadosMembro?.nomePai} label="Nome Pai:" />
          </p>
          <p>
            <Input name="nomeMae" type="text" size="35" defaultValue={dadosMembro?.nomeMae} label="Nome Mãe:" />
          </p>
          <h4 className="subTituloCadMembro">Endereço Residencial</h4>
          <p>
            <Input name="logradouro" type="text" size="35" defaultValue={dadosMembro?.logradouro} label="Logradouro:" />
          </p>
          <p>
            <Input name="bairro" type="text" size="25" defaultValue={dadosMembro?.bairro} label="Bairro:" />
          </p>
          <p>
            <Input name="cep" type="tel" size="9" defaultValue={dadosMembro?.cep} label="CEP:" onChange={formatarCep} />
          </p>
          <p>
            <Input name="cidade" type="text" size="25" defaultValue={dadosMembro?.cidade} label="Cidade:" />
          </p>
          <p>
            <Input name="complemento" type="text" size="35" defaultValue={dadosMembro?.complemento} label="Complemento:" />
          </p>
          <p>
            <Input
              name="telResidencial"
              type="tel"
              size="16"
              defaultValue={dadosMembro?.telResidencial}
              label="Telefone:"
              onChange={formatarTelefone}
            />
          </p>
          <h4 className="subTituloCadMembro">Dados Complementares</h4>
          <span>
            <p>Possui Vínculo Maçônico ?:</p>
            <p>
              <Input name="parentescoMaconico" type="radio" defaultValue={dadosMembro?.parentescoMaconico} label="Sim" checked={vinculoMaconico === 'S'} onChange={() => {
                defineVinculoMaconico('S');
              }} />
            </p>
            <p>
              <Input name="parentescoMaconico" type="radio" defaultValue={dadosMembro?.parentescoMaconico} label="Não" checked={vinculoMaconico === 'N'} onChange={() => {
                defineVinculoMaconico('N');
              }} />
            </p>
          </span>
          <div className={vinculoMaconico === "S" ? "" : "ocultaVinculoMaconico"}>
            <p>
              <Input name="nomeMacon" type="text" size="35" defaultValue={dadosMembro?.nomeMacon} label="Nome do Maçon:" />
            </p>
            <p>
              <Input name="nomeLoja" type="text" size="25" defaultValue={dadosMembro?.nomeLoja} label="Loja:" />
            </p>
            <p>
              <Input name="numeroLoja" type="tel" size="3" defaultValue={dadosMembro?.numeroLoja} label="Nº Loja:" />
            </p>
            <p>
              <Input name="grauParentesco" type="text" size="20" defaultValue={dadosMembro?.grauParentesco} label="Grau do Parentesco:" />
            </p>
            <p>
              <Input name="enderecoParentesco" type="text" size="35" defaultValue={dadosMembro?.enderecoParentesco} label="Endereço:" />
            </p>
            <p>
              <Input name="bairroParentesco" type="text" size="25" defaultValue={dadosMembro?.bairroParentesco} label="Bairro:" />
            </p>
            <p>
              <Input name="cepParentesco" type="tel" size="9" defaultValue={dadosMembro?.cepParentesco} label="CEP:" onChange={formatarCep} />
            </p>
            <p>
              <Input name="cidadeParentesco" type="text" size="25" defaultValue={dadosMembro?.cidadeParentesco} label="Cidade:" />
            </p>
            <p>
              <Input name="telParentesco" type="tel" size="16" defaultValue={dadosMembro?.telParentesco} label="Telefone:" onChange={formatarTelefone} />
            </p>
          </div>
          <h4 className="subTituloCadMembro">Outras informações</h4>
          <p>
            <Input name="senha" type="text" size="20" defaultValue={dadosMembro?.senha} label="Senha:" />
          </p>
          <p>Nível de Acesso:</p>
          <span>
            <p>
              <Input name="nivelAcesso" type="radio" defaultValue={dadosMembro?.nivelAcesso} label="Normal" checked={radioValueNivelAcesso === '1'} value='1' onChange={radioNivelAcesso} />
            </p>
            <p>
              <Input name="nivelAcesso" type="radio" defaultValue={dadosMembro?.nivelAcesso} label="Tesouraria" checked={radioValueNivelAcesso === '2'} value='2' onChange={radioNivelAcesso} />
            </p>
            <p>
              <Input name="nivelAcesso" type="radio" defaultValue={dadosMembro?.nivelAcesso} label="Secretaria" checked={radioValueNivelAcesso === '3'} value='3' onChange={radioNivelAcesso} />
            </p>
            <p>
              <Input name="nivelAcesso" type="radio" defaultValue={dadosMembro?.nivelAcesso} label="Geral" checked={radioValueNivelAcesso === '4'} value='4' onChange={radioNivelAcesso} />
            </p>
          </span>
          <span>
            <p>Situação Membro:</p>
            <p>
              <Input name="situacao" type="radio" defaultValue={dadosMembro?.situacao} label="Ativo" checked={radioValueSituacao === 'A'} value='A' onChange={radioSituacao} />
            </p>
            <p>
              <Input name="situacao" type="radio" defaultValue={dadosMembro?.situacao} label="Irregular" checked={radioValueSituacao === 'I'} value='I' onChange={radioSituacao} />
            </p>
            <p>
              <Input name="situacao" type="radio" defaultValue={dadosMembro?.situacao} label="Falecido(a)" checked={radioValueSituacao === 'F'} value='F' onChange={radioSituacao} />
            </p>
          </span>
          <div className={radioValueSituacao === "F" ? "" : "ocultaVinculoMaconico"}>
            <p>
              <Input name="dataFalecimento" type="date" defaultValue={dadosMembro?.dataFalecimento} label="Dt Falecimento:" />
            </p>
          </div>
          <div className="bt_cadMembro">
            <button type="reset" onClick={() => { navigate('/listamembros') }} >Cancelar</button>
            <button type="submit" >Confirmar
            </button>
          </div>
        </div>
      </form>
    </>
  )
}