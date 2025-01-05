import React from "react";

export const formatarTelefone = (id) => {
  const elemento = document.getElementById(id);
  const valor = elemento.value;
  valor = valor.replace(/\D/g, "");   //Remove tudo o que não é dígito
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  valor = valor.replace(/(\d)(\d{8})$/, "$1 $2");//Coloca espaço apos primeiro numero (9) do corpo principal 
  valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");//Coloca hífen entre o quarto e o quinto dígitos
  elemento.value = valor;
}

export const formatarCPF = (id) => {
  const elemento = document.getElementById(id);
  const valor = elemento.value;
  valor = valor.replace(/\D/g, "");   //Remove tudo o que não é dígito
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  elemento.value = valor;
}

export const formatarData = (id) => {
  const elemento = document.getElementById(id);
  const valor = elemento.value;
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{2})(\d)/g, "$1/$2");
  valor = valor.replace(/(\d)(\d{4})$/, "$1/$2");
  elemento.value = valor;
}

export const formatarCep = (e) => {
  const elemento = document.getElementById(e);
  const valor = elemento.value;
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{5})(\d)/g, "$1-$2");
  elemento.value = valor;
}