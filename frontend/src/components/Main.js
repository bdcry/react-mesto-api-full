import React from "react";
import IconEdit from "../images/icon-edit.svg";
import IconAdd from "../images/icon-add.svg";
import Card from "./Card";
import "../index.css";
import { CurrentUserContext } from "../context/CurrentUserContext";
import Spinner from "./Spinner";

function Main(props) {
  const userData = React.useContext(CurrentUserContext);

  return props.isLoading ? (
    <Spinner />
  ) : (
    <main className="content">
      <section className="profile content__profile">
        <div className="profile__avatar-img">
          <img
            src={`${userData.avatar}`}
            alt="Фото профиля"
            className="profile__avatar"
          />
          <button
            onClick={props.onEditAvatar}
            title="Загрузить аватар"
            className="profile__avatar-button"
          ></button>
        </div>
        <h1 className="profile__user-name">{`${userData.name}`}</h1>
        <p className="profile__user-job">{`${userData.about}`}</p>
        <button
          onClick={props.onEditProfile}
          type="button"
          className="profile__edit-button"
        >
          <img
            src={IconEdit}
            alt="Редактировать профиль"
            className="profile__icon-button"
          />
        </button>
        <button
          onClick={props.onAddPlace}
          type="button"
          className="profile__add-button"
        >
          <img
            src={IconAdd}
            alt="Добавить"
            className="profile__icon-addbutton"
          />
        </button>
      </section>
      <section className="elements content__elements">
        {props.cards.map((card) => {
          return (
            <Card
              card={card}
              key={card._id}
              onCardClick={props.onCardClick}
              onImageClick={props.onImageClick}
              onCardClickLike={props.onCardClickLike}
              onCardDelete={props.onCardDelete}
              onTrashClick={props.onTrashClick}
            />
          );
        })}
      </section>
    </main>
  );
}

export default Main;
