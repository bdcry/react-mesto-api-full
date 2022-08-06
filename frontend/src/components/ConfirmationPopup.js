import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmationPopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.onConfirmDelete(props.card);
  }

  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      text={props.isConfirm ? "Магия исчезновения..." : "Да"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
}

export default ConfirmationPopup;
