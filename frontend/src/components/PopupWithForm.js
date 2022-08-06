import React from "react";

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen && "popup_opened"
      }`}
    >
      <div className="popup__window">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрыть"
          onClick={props.onClose}
        ></button>
        <div className="popup__form">
          <h2 className="popup__title">{`${props.title}`}</h2>
          <form
            onSubmit={props.onSubmit}
            name={`${props.name}`}
            className={`popup__form`}
            noValidate
          >
            {props.children}
            <button type="submit" className="popup__save-button">
              {props.text}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PopupWithForm;
