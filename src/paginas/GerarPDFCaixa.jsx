import React from 'react';
import jsPDF from 'jspdf';
import { AMBIENTE, CIDADE_CAPITULO, NOME_CAPITULO, POTENCIA_CAPITULO, URL_CAIXA } from '../compartilhados/constantes';
import './TransparenciaFinanceira.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { toMoneyBr } from '../compartilhados/funcoes';

export const GerarPDFCaixa = (props) => {
  const { onClose, contaSel, mesAnoSel } = props;
  const [listaCaixaPDF, setListaCaixaPDF] = React.useState([]);
  const [somasCaixaPDF, setSomasCaixaPDF] = React.useState([]);

  React.useEffect(() => {
    axios.get(URL_CAIXA, {
      params: {
        opc: 'buscaLancamentos',
        conta: contaSel,
        mesAno: mesAnoSel.toString().padStart(7, '0'),
        ambiente: AMBIENTE
      }
    }).then((resposta) => {
      setSomasCaixaPDF(resposta.data);
      setListaCaixaPDF(resposta.data);
      // console.log(resposta.data);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
      fecharModalPDFCaixa();
    })
  }, []);

  const fecharModalPDFCaixa = () => {
    onClose();
  }

  /// variaveis comuns para cabecalho, corpo 
  const doc = new jsPDF();
  let nomeConta = 'Capítulo';
  if (contaSel == 2) {
    nomeConta = 'Solidariedade';
  }
  const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mesSel = mesesAbreviados[mesAnoSel.split('/', 1)[0] - 1] + '/' + mesAnoSel.split('/', 2)[1];
  const nomeArquivo = 'caixa_' + nomeConta + '_' + mesSel + '.pdf';
  let lin = 41;
  //////////////////////////////////////////
  const geraPDF = () => {
    ///    inicia propriamente o relatorio PDF
    cabPDF();
    listaCaixaPDF.map((caixa) => {
      lin = lin + 6;
      let tamCompl = 0;
      for (let i in caixa.complemento) {
        if (caixa.complemento.hasOwnProperty(i)) {
          tamCompl++;
        }
      }
      return (
        <li key={caixa.id}>
          {doc.text(caixa.dataMovimento.substr(8, 2), 6, lin)}
          {doc.text(caixa.historicoPadrao.substr(0,34), 14, lin)}
          {caixa?.idHistorico == 1 ? (
            doc.text([caixa.nomeMembro.substr(0,32)], 90, lin),lin = lin + 5,
            doc.text(('(Ref. mês: ' + caixa.mesAno + ')'), 90, lin)) : doc.text([caixa.complemento.substr(0,32)], 90, lin)
          }
          {caixa?.statusLancamento == "D" ? (
            doc.text(toMoneyBr(caixa.valor), 177, lin, { align: 'right' })
          ) : null}
          {caixa?.statusLancamento == "C" ? (
            doc.text(toMoneyBr(caixa.valor), 203, lin, { align: 'right' })
          ) : null}
          {doc.setDrawColor(0,255,0)}
          {doc.line(5,lin+2,205,lin+2)}
          {doc.setDrawColor(0,0,0)}          
        </li >
      )
    })
    //, { align: 'right' }
    doc.save(nomeArquivo);
  }
  /*
    const splitText = (texto, col, larg, alinhamento) => {
      let splitTexto = doc.splitTextToSize(texto, larg);
      
      for (let i = 0; i < splitTexto.length; i++) {
        if (lin > 175) {
          lin = 47;
          doc.addPage();
          cabPDF();
        }
        doc.text(col, lin, splitTexto[i], {align : alinhamento});
        
          lin = lin + 5;
         
      }
    }
  */
  const cabPDF = () => {
    doc.setDisplayMode('fullwidth', 'single');
    //doc.setPage();
    doc.setLineWidth(0.1);
    doc.rect(5, 5, 200, 285);
    //// faz o rodape
    doc.setFontSize(7);
    doc.text('Impresso por Sistemas Web - (11) 9 6769-3975 - Todos os Direitos Reservados', 90, 293);
    ////// fim rodape
    doc.addImage('img/novaLogoEstrela.png', 6, 6, 30, 30);
    doc.setFontSize(14);
    doc.text(NOME_CAPITULO, 65, 12);
    doc.setFontSize(12);
    doc.text(POTENCIA_CAPITULO, 65, 20);
    doc.text(CIDADE_CAPITULO, 91, 28);
    doc.text('Relatório de Fluxo de Caixa', 77, 35);
    // doc.rect(172, 5, 33, 32);
    doc.addImage('img/logoGLMECE.png', 174, 6, 30, 30);
    doc.line(5, 37, 205, 37);
    doc.setFontSize(10);
    doc.text('Conta: ' + [nomeConta], 37, 35);
    doc.text('Mês: ' + [mesSel], 152, 35);
    doc.setFontSize(12);
    doc.line(5, 42, 205, 42);//col,lin,col,lin
    doc.text('Dia', 6, 41);
    doc.text('Descrição do lançamento', 14, 41);
    doc.text('Complemento', 90, 41);
    doc.text('Débito', 165, 41);
    doc.text('Crédito', 190, 41);
  }

  return (
    <>
      <div className='titGerarPDF'>
        <h3>Gerar Arquivo PDF</h3>
      </div>
      <div className='containerGerarPDF'>
        <p>
          Ao confirmar, será gerado um arquivo no formato PDF com o fluxo de caixa, conforme a conta e o mês selecionado na tela anterior.
        </p>
        <p>
          A impressão irá depender do aplicativo instalado em seu aparelho  para tal função.
        </p>
      </div>
      <div>
        <button className='bt_cancelarPDF' type="reset" onClick={fecharModalPDFCaixa}>Cancelar
        </button>
        <button className='bt_gerarPDF' type="button" onClick={geraPDF}>Confirmar PDF
        </button>
      </div>
    </>
  );
}
