import React from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";

function Card(props) {
  const userData = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === userData._id;

  const cardDeleteButtonClassName = `element__delete element__delete_visible ${
    isOwn ? "" : "popup element__delete"
  }`;
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some((i) => i._id === userData._id);

  const cardLikeButtonClassName = `element__heart ${
    isLiked ? "element__heart-active" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
    props.onImageClick();
  }

  function handleCardClickLike() {
    props.onCardClickLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
    props.onTrashClick();
  }
  return (
    <article className="element">
      <button
        onClick={handleDeleteClick}
        className={cardDeleteButtonClassName}
        aria-label="Удалить"
      ></button>
      <img
        onClick={handleClick}
        src={`${props.card.link}`}
        alt={`${props.card.name}`}
        className="element__photo"
      />
      <div className="element__text">
        <h2 className="element__title">{`${props.card.name}`}</h2>
        <div>
          <button
            onClick={handleCardClickLike}
            type="button"
            className={cardLikeButtonClassName}
            aria-label="Лайкнуть"
          ></button>
          <br />
          <span className="element__heart-count">{`${props.card.likes.length}`}</span>
        </div>
      </div>
    </article>
  );
}

export default Card;
