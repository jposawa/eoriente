/* eslint-disable react/prop-types */
import styles from "./Button.module.css";

export const Button = (props) => {
  const { className = "", type = "button", children, onClick = () => {} } = props;

  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}