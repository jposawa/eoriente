import React from "react";
import './TransparenciaFinanceira.css';
import { Popconfirm } from "antd";
import { CalculatorOutlined, DeleteOutlined, OrderedListOutlined, ProjectOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil"
import { usuarioLogadoAtom } from "../compartilhados/estados"
import { Link } from "react-router-dom";
import { Select } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export const TransparenciaFinanceira = () => {
  const [usuarioLogado, defineUsuarioLogado] = useRecoilState(usuarioLogadoAtom);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onChangeMA = (value) => {
    console.log(`selected ${value}`);
  };

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const mesAnoAtual = 'Jan/2025';
  //let opcs = new Object;
  let options = new Object;
  let mesAno = new Array;
  let anos = 2025;
  let m = 0;
  for (let i = 0; i<=17; i++){
    mesAno.push(meses[m])
     
    console.log((m+1)+"/"+anos+" - "+mesAno[m]+"/"+anos);
 
    options = [{
      value: (m+1)+"/"+anos,
      label: mesAno[m]+"/"+anos
    }]
  
    m = m + 1;
    if (m>11) {
      anos++;
      m = 0;
    }
  }
  
/*
  const options = [
    {
      value: '01/2025',
      label: 'Jan/2025',
    },
    {
      value: '02/2025',
      label: 'Fev/2025',
    },
    {
      value: '03/2025',
      label: 'Mar/2025',
    },
    {
      value: '11/2025',
      label: 'Nov/2025',
    },
  ]
*/
  return (
    <>
      <h3 className="titTranspFinanc">Transparência Financeira</h3>
      <div className="corpoTranspFinanc">
        <div className="escolhaMes">
          <p>Conta:
            <Select
              placeholder="Selec."
              defaultValue="Caixa"
              onChange={onChange}
              options={[
                {
                  value: '1',
                  label: 'Caixa ',
                },
                {
                  value: '2',
                  label: 'Tronco',
                },
              ]}
            />
          </p>
          <p>Mês/Ano:
            {/*    <DatePicker
          defaultValue={dayjs('2025/01',"MM/YYYY")} format="MM/YYYY"
          onChange={onChangeMA} 
          picker="month" /> */}
            <Select
              placeholder="Selecione um mês"
              defaultValue={mesAnoAtual}
              onChange={onChange}
              options={options}
            />
          </p>
        </div>
        <div className="cabecalhoCaixa">
          <p>
            <Popconfirm
              title="Excluir Lançamento"
              description="Confirma exclusão ?"
              onConfirm={() => {
                excluirLancCaixa()
              }}
              okText="Sim"
              cancelText="Não"
            >
              <button type="button">
                <DeleteOutlined />
              </button>
            </Popconfirm>
          </p>
          <p>Dia</p>
          <p>Descrição Lançamento</p>
          <p>Débito</p>
          <p>Crédito</p>
        </div>
      </div>
      <div className="totaisInformados">
        <div>
          <p>Saldo Anterior:</p>
          <p>Soma do Mês:</p>
          <p>Saldo Atual:</p>
        </div>
        <div>
          <p>1.200,00</p>
          <p>500,00</p>
          <p>1.700,00</p>
        </div>
      </div>
      <nav className="menuTranspFinanc">
        {usuarioLogado?.nivelAcesso > 3 ? (
          <li>
            <OrderedListOutlined />
            <p>Lançamento</p>
          </li>
        ) : null}
        <li>
          <CalculatorOutlined />
          <p>Resumo</p>
          <p>Mês</p>
        </li>
        <li>
          <ProjectOutlined />
          <p>Gráfico</p>
          <p>Mensal</p>
        </li>
        {usuarioLogado?.nivelAcesso > 3 ? (
          <li>
            <OrderedListOutlined />
            <p>Manutenção</p>
            <p>Lanç.Padrão</p>
          </li>
        ) : null}
        <li>
          <Link to='../listamembros'>
            <RollbackOutlined />
            <p>Retornar</p>
          </Link>
        </li>
      </nav>
    </>
  )
}