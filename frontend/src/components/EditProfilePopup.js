import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../context/CurrentUserContext";

function EditProfilePopup(props) {
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

  const userData = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setUserName(userData.name);
    setUserDescription(userData.about);
  }, [userData, props.isOpen]);

  const [userName, setUserName] = React.useState("");
  const [userDescription, setUserDescription] = React.useState("");

  function handleChangeUserName(e) {
    setUserName(e.target.value);
  }

  function handleChangeUserDescription(e) {
    setUserDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name: userName,
      about: userDescription,
    });
  }
  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      text={props.isConfirm ? "Сохранение..." : "Сохранить"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={userName || ""}
        onChange={handleChangeUserName}
        id="name"
        type="text"
        name="name"
        placeholder="Имя"
        className="popup__input popup__input_string_name"
        minLength={2}
        maxLength={40}
        required
      />
      <span id="name-error" className="popup__error"></span>
      <input
        value={userDescription || ""}
        onChange={handleChangeUserDescription}
        id="profession"
        type="text"
        name="about"
        placeholder="Работа"
        className="popup__input popup__input_string_job"
        minLength={2}
        maxLength={200}
        required
      />
      <span id="profession-error" className="popup__error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
