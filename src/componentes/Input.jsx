import "./Input.css";

export const Input = ({
  label,
  className,
  ...props
}) => {
  return (
    <label className={`containerInput ${className}`}>
      {!label ? null : <p>{label}</p>}
      <input {...props} />
    </label>
  );
}