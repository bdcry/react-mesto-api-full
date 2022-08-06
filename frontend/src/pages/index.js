import { Api } from "../components/Api.js";
import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithConfirm } from "../components/PopupWithConfirm.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";

import "../pages/index.css";

import {
  initialCards,
  validationConfig,
  elements,
  cardTemplateSelector,
  buttonOpenEditProfilePopup,
  userName,
  userjob,
  popupTypeEdit,
  nameInput,
  jobInput,
  buttonProfileClose,
  profileForm,
  buttonAdd,
  popupTypeCard,
  cardNameInput,
  cardUrlInput,
  buttonCardClose,
  cardFormAdd,
  popupImage,
  buttonImageClose,
  buttonCardsSave,
  imgName,
  imgUrl,
  avatarButton,
  avatarForm,
  inputAvatarUrl,
} from "../utils/constants.js";

let userId;

const api = new Api({
  url: "https://nomoreparties.co/v1/cohort-40/",
  headers: {
    authorization: "370f7f15-595f-448e-a03a-a4a289412e90",
    "Content-Type": "application/json",
  },
});

api
  .getAllData()
  .then(([data, user]) => {
    userId = user._id;
    userData.setUserInfo(user.name, user.about); // вставляем из объекта User нужные нам данные, name, about и аватар
    userData.setUserAvatar(user.avatar);

    data.forEach((item) => {
      const card = cardCreate(item).createCard();
      cardSection.addItemServer(card);
    });
  })
  .catch((err) => console.log(err));

const formValidProfile = new FormValidator(validationConfig, profileForm);
const formValidCard = new FormValidator(validationConfig, cardFormAdd);
const formValidAvatar = new FormValidator(validationConfig, avatarForm);

// константа класса юзерФормы
const userData = new UserInfo({
  name: ".profile__user-name",
  about: ".profile__user-job",
  avatar: ".profile__avatar",
});

// константа класса реализации карточки в DOM
const cardSection = new Section(
  {
    items: [],
    renderer: (item) => {
      const card = cardCreate(item);
      return card;
    },
  },
  ".elements"
);

// константы под классов popup'а
const popupCardImg = new PopupWithImage(
  { selectorPopup: ".popup_type_image" },
  imgUrl,
  imgName
);

const popupCardAdd = new PopupWithForm({
  selectorPopup: ".popup_type_card",
  functionPopupForm: (card) => {
    handleCardFormSubmit(card);
  },
});

const popupProfileEdit = new PopupWithForm({
  selectorPopup: ".popup_type_edit",
  functionPopupForm: (data) => {
    handleProfileFormSubmit(data);
  },
});

const popupAvatarEdit = new PopupWithForm({
  selectorPopup: ".popup_type_edit-avatar",
  functionPopupForm: (avatar) => {
    handleAvatarFormSubmit(avatar);
  },
});

const popupDeletion = new PopupWithConfirm({
  selectorPopup: ".popup_type_delete",
});

// открывает popup карточки
function handleCardClick(name, link) {
  popupCardImg.open(name, link);
}

// создание карточки
function cardCreate(item) {
  const cardItem = new Card(
    item,
    cardTemplateSelector,
    handleCardClick,
    (id) => { 
      popupDeletion.open(); 
      popupDeletion.changeSubmitHandler(() => { 
        api 
          .deleteCard(id) 
          .then(() => { 
            cardItem.deleteCard(); 
            popupDeletion.close(); 
          })
          .catch((err) => console.log(err)); 
      });
    },
    (id) => {
      if (cardItem.toggleLike()) {
        api
          .deleteLike(id)
          .then((res) => {
            cardItem.setLikes(res.likes);
          })
          .catch((err) => console.log(err));
      } else {
        api
          .addLike(id)
          .then((res) => {
            cardItem.setLikes(res.likes);
          })
          .catch((err) => console.log(err));
      }
    },
    userId
  );
  return cardItem;
}


// открывает popup создание новой карточки
function openPopupCard() {
  popupCardAdd.open();
  cardUrlInput.value = "";
  formValidCard.resetValidation();
}

function openPopupAvatar() {
  popupAvatarEdit.open();
  inputAvatarUrl.value = "";
  formValidAvatar.resetValidation();
}

function handleCardFormSubmit(item) {
  popupCardAdd.renderLoading(true);
  api.createCard(item).then((data) => {
    const card = cardCreate(data).createCard();
    cardSection.addItemUser(card);
    popupCardAdd.close();
  })
  .finally( _ => popupCardAdd.renderLoading(false))
  .catch((err) => console.log(err, err.status))
}

// обрабатыватываем отправку формы замены аватара
function handleAvatarFormSubmit(link) {
  popupAvatarEdit.renderLoading(true);
  api
    .setUserAvatar(link.link)
    .then((res) => {
      userData.setUserAvatar(res.avatar);
      popupAvatarEdit.close();
    })
    .finally( _ => popupAvatarEdit.renderLoading(false))
    .catch((err) => console.log(err, err.status));
}

// обрабатыватываем отправку формы профиля
function handleProfileFormSubmit(data) {
  const { name, about } = data;
  popupProfileEdit.renderLoading(true);
  api
    .setUserInfo(name, about)
    .then((user) => {
      userData.setUserInfo(user.name, user.about);
      popupProfileEdit.close();
    })
    .finally( _ => popupProfileEdit.renderLoading(false))
    .catch((err) => console.log(err));
}

// Профиль
function openPopupProfile() {
  popupProfileEdit.open();
  const newUserData = userData.getUserInfo();
  nameInput.value = newUserData.name;
  jobInput.value = newUserData.about;
  formValidProfile.resetValidation();
}

/* Запуск функций */
// Запуск метода валидации для каждой из форм
formValidProfile.enableValidation();
formValidCard.enableValidation();

// Реализация карточек
// cardSection.setItems();
formValidAvatar.enableValidation();

/* EventListeners */
// Popup добавления нового места
buttonAdd.addEventListener("click", () => openPopupCard()); // открывает popup добавления места
popupCardAdd.setEventListeners(); // закрывает popup'a добавления места

// Popup удаления карточки
popupDeletion.setEventListeners(); // для popup'а удаления карточки

// Popup открытой карточки
popupCardImg.setEventListeners(); // закрывает popup'a открытой карточки

// Профиль
buttonOpenEditProfilePopup.addEventListener("click", () => openPopupProfile());
popupProfileEdit.setEventListeners(); // закрытие popup'a профиля

// Popup обновления аватара
avatarButton.addEventListener("click", () => openPopupAvatar());
popupAvatarEdit.setEventListeners();
