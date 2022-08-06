import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
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

  const [cardName, setCardName] = React.useState('');
  const [cardLink, setCardLink] = React.useState('');

  function handleChangeCardName(e) {
    setCardName(e.target.value)
  }

  function handleChangeCardLink(e) {
    setCardLink(e.target.value)
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddPlace({ 
      name: cardName,
      link: cardLink });
  }

  React.useEffect(() => {
    setCardName('');
    setCardLink('')
  },[props.isOpen])
  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      text={props.isConfirm ? 'Происходит магия...' : 'Сохранить'}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={cardName || ''}
        onChange={handleChangeCardName}
        id="card-name"
        type="text"
        name="name"
        placeholder="Название места"
        className="popup__input popup__input_card_name"
        minLength={2}
        maxLength={30}
        required
      />
      <span id="card-name-error" className="popup__error"></span>
      <input
        value={cardLink ? cardLink : ''}
        onChange={handleChangeCardLink}
        id="cardUrl"
        type="url"
        name="link"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_card_url"
        required
      />
      <span id="cardUrl-error" className="popup__error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
