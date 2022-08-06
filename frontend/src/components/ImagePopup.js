import React from "react";

function ImagePopup(props) {
  React.useEffect(() => {
    if (!props.isOpen) return;

    function handleEsc(e) {
      if (e.key === "Escape") {
        props.onClose();
      }
    }

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [props.isOpen]);

  React.useEffect(() => {
    if (!props.isOpen) return;

    function handleClickClose(e) {
      if (e.target.className.includes("popup_opened")) {
        props.onClose();
      }
    }

    document.addEventListener("mousedown", handleClickClose);
    return () => {
      document.removeEventListener("mousedown", handleClickClose);
    };
  }, [props.isOpen]);

  return (
    <div className={`popup popup_type_image ${props.isOpen && "popup_opened"}`}>
      <div className="popup__image-window">
        <button
          onClick={props.onClose}
          className="popup__close-button"
          type="button"
          aria-label="Закрыть"
        ></button>
        <figure className="popup__image-window">
          {props.card && (
            <img
              className="popup__image-url"
              src={props.card.link}
              alt={`${props.card.name}`}
            />
          )}
          {props.card && (
            <figcaption className="popup__image-name">
              {props.card.name}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}
export default ImagePopup;
