import React from "react";
import "./Modal.css";

export const Modal = (props) =>{
  const { open, onClose, children, className="" } = props;
  const modalRef = React.useRef(null);
  const onClick = React.useCallback(
    ({ target }) => {
      const { current: el } = modalRef;
      if (target === el){
        onClose();
      }
    },
    [onClose]
  );

  React.useEffect(() => {
    const { current: el } = modalRef;
    if (open){
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);  

  return(
    <dialog ref={modalRef} className={`baseModal ${className}`} onClose={onClose} onClick={onClick}>
      <div className="conteudoModal">{children}</div>
    </dialog>
  );
}