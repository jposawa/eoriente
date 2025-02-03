import React from 'react';
import jsPDF from 'jspdf';
import { AMBIENTE, CIDADE_CAPITULO, LOGO_CAPITULO, LOGO_POTENCIA, NOME_CAPITULO, POTENCIA_CAPITULO, URL_CAIXA } from '../compartilhados/constantes';
import './TransparenciaFinanceira.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { toMoneyBr } from '../compartilhados/funcoes';
import { colorToComponents } from 'pdf-lib';

export const GerarPDFCaixa = (props) => {
  const { onClose, contaSel, mesAnoSel } = props;
  const [listaCaixaPDF, setListaCaixaPDF] = React.useState([]);
  const [somasCaixaPDF, setSomasCaixaPDF] = React.useState([]);
  const today = new Date();
  const dataExtenso = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };
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
      console.log(resposta.data);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
      fecharModalPDFCaixa();
    })
  }, []);

  const fecharModalPDFCaixa = () => {
    onClose();
  }

  /// variaveis comuns para cabecalho, corpo e rodape
  const doc = new jsPDF('p','mm','a4');
  let nomeConta = 'Capítulo';
  if (contaSel == 2) {
    nomeConta = 'Solidariedade';
  }
  const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mesSel = mesesAbreviados[mesAnoSel.split('/', 1)[0] - 1] + '/' + mesAnoSel.split('/', 2)[1];
  const nomeArquivo = 'caixa_' + nomeConta + '_' + mesSel + '.pdf';
  let lin = 41;
  let nPag = 0;
  //////////////////////////////////////////
  const geraPDF = () => {
    ///    inicia propriamente o relatorio PDF
    cabPDF();
    listaCaixaPDF.map((caixa) => {
      lin = lin + 6;
      if (lin > 255) {
        lin = 47;
        doc.addPage();
        cabPDF();
      }

      return (
        <li key={caixa.id}>
          {doc.text(caixa.dataMovimento.substr(8, 2), 7, lin)}
          {doc.line(13, lin-4, 13, lin+2)}
          {doc.text(caixa.historicoPadrao.substr(0, 34), 14, lin)}
          {doc.line(89, lin-4, 89, lin+2)}
          {caixa?.idHistorico == 1 ? (
            doc.text([caixa.nomeMembro.substr(0, 32)], 90, lin),
            doc.line(157, lin-4, 157, lin+2),
            doc.line(179, lin-4, 179, lin+2),
            lin = lin + 5,
            doc.text(('(Ref. mês: ' + caixa.mesAno + ')'), 90, lin),
            doc.line(13, lin-4, 13, lin+2),
            doc.line(89, lin-4, 89, lin+2),
            doc.line(157, lin-4, 157, lin+2),
            doc.line(179, lin-4, 179, lin+2))
            : doc.text([caixa.complemento.substr(0, 32)], 90, lin)
            [doc.line(157, lin-4, 157, lin+2),
            doc.line(179, lin-4, 179, lin+2)]
          }
          {caixa?.statusLancamento == "D" ? (
            doc.line(179, lin-4, 179, lin+2),
            doc.text(toMoneyBr(caixa.valor), 177, lin, { align: 'right' })
          ) : doc.text('------',171,lin, { align: 'center' })}
          {caixa?.statusLancamento == "C" ? (
            doc.text(toMoneyBr(caixa.valor), 204, lin, { align: 'right' })
          ) :  doc.text('------',198,lin, { align: 'center' })}
          {doc.line(5, lin + 2, 205, lin + 2)}
        </li >
      )
    })

    /// Inicia final do relatorio (arquivo PDF)
    somasCaixaPDF.slice(-1).map((saldos) => {
      lin = lin + 6;
      if (lin > 255) {
        lin = 47;
        doc.addPage();
        cabPDF();
      }
      return (
        <li key={saldos.id}>
          {doc.line(112, lin - 4, 112, lin + 20)}
          {doc.line(152, lin - 4, 152, lin + 20)}
          {doc.setFontSize(8)}
          {doc.text(CIDADE_CAPITULO + ',' + dataExtenso(today),6, lin+1)}
          {doc.setFontSize(12)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Somas:', 136, lin)}
          {doc.text(toMoneyBr(saldos.somaDebito), 178, lin, { align: 'right' })}
          {doc.line(179, lin-4, 179, lin+2)}
          {doc.text(toMoneyBr(saldos.somaCredito), 204, lin, { align: 'right' })}
          {doc.line(112, lin + 2, 205, lin + 2)}
          {doc.setFont("helvetica", "normal")}
          {lin  = lin + 6}
          {doc.text('Saldo do mês (+)', 119, lin)}
          {doc.text([toMoneyBr(saldos.somaCredito-saldos.somaDebito)], 204, lin, { align: 'right' })}
          {doc.line(112, lin + 2, 205, lin + 2)}
          {lin  = lin + 6}
         
          {doc.text('Saldo anterior (+)', 118.5, lin)}
          {doc.text(toMoneyBr(saldos.saldoAnterior), 204, lin, { align: 'right' })}
          {doc.line(112, lin + 2, 205, lin + 2)}
         
          {doc.setFontSize(8)}
          {doc.text('_________________________________________________',10, lin)}
          {doc.text('Tesoureiro(a) do Capítulo',32,lin+4)}
          {lin  = lin + 6}
          {doc.setFontSize(12)}
          {doc.setFont("helvetica", "bold")}
          {doc.setFillColor('#87CEEB')}
          {doc.rect(152.1,lin-3.9,52.9,5.9,'F')}
          {doc.text('SALDO ATUAL (=)', 114.5, lin)}
          {doc.text(toMoneyBr(saldos.saldoAnterior + (saldos.somaCredito-saldos.somaDebito)), 204, lin, { align: 'right' })}   
          {doc.setFont("helvetica", "normal")}
          {doc.line(5, lin + 2, 205, lin + 2)}
        </li >
      )
    })
    doc.save(nomeArquivo);
  }

  const cabPDF = () => {
    doc.setDisplayMode('fullwidth', 'single');
    doc.setDrawColor(0, 10, 0) // bordas e lines cinza
    //doc.setPage();
    doc.setLineWidth(0.1);
    doc.rect(5, 5, 200, 285);
    //// faz o rodape
    const totPag = doc.getNumberOfPages();
    nPag++;
    doc.setFontSize(7);
    doc.text('Impresso por Sistemas Web - (11) 9 6769-3975 - Todos os Direitos Reservados', 90, 293);
    doc.text('Página: ' + nPag + '/' + totPag, 185, 293);
    ////// fim rodape
    doc.addImage(LOGO_CAPITULO, 6, 6, 30, 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(NOME_CAPITULO, 65, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(POTENCIA_CAPITULO, 65, 20);
    doc.text(CIDADE_CAPITULO, 91, 28);
    doc.text('Relatório de Fluxo de Caixa', 77, 35);
    // doc.rect(172, 5, 33, 32);
    doc.addImage(LOGO_POTENCIA, 174, 6, 30, 30);
    doc.line(5, 37, 205, 37);
    doc.setFontSize(10);
    doc.text('Conta: ' + [nomeConta], 37, 35);
    doc.text('Mês: ' + [mesSel], 152, 35);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.line(5, 43, 205, 43);//col,lin,col,lin
    {doc.setFillColor('#87CEEB')}
    {doc.rect(5.1,lin-3.9,199.8,5.8,'F')}
    doc.text('Dia', 6, 41);
    doc.text('Descrição do lançamento', 14, 41);
    doc.text('Complemento', 90, 41);
    doc.text('Débito', 165, 41);
    doc.text('Crédito', 189, 41);
    doc.line(13, 37, 13, 43);
    doc.line(89, 37, 89, 43);
    doc.line(157, 37, 157, 43);
    doc.line(179, 37, 179, 43);
    doc.setFont("helvetica", "normal");
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
