/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "..";

import styles from "./Contador.module.css";

export const Contador = (props) => {
  const { label = "Contador" } = props;
  const [valorContador, attValorContador] = React.useState(0);

  const incrementaContador = () => {
    attValorContador(valorContador + 1);
  }

  return (
    <Button className={styles.contador} onClick = {incrementaContador}>{label} ({valorContador})</Button>
  )
}