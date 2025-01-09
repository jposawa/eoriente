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
  let options = new Object;
  let  anos = new Date();
  let mesAtual = anos.getMonth();
  anos = anos.getFullYear(); // ano atual
  let opcs = new Array;
  for (let i = 0; i<=17; i++){
    console.log((mesAtual)+'/'+anos);
    options = {
      value: (mesAtual)+"/"+anos,
      label: meses[mesAtual]+"/"+anos
    }
    opcs[i] = options;
    if (mesAtual==0) {
      mesAtual = 12;
      anos--;
      mesAtual--;
    } else {
      mesAtual--;
    }
  }
 
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
              options={opcs}
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