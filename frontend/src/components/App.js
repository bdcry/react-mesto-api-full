import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import InfoTooltip from "./InfoTooltip";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { api } from "../utils/Api";
import auth from "../utils/Auth";
import Ok from "../images/Ok.svg";
import Err from "../images/Err.svg";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmDeleteCard, setIsConfirmDeleteCard] = React.useState(false);
  const [isConfirmating, setIsConfirmatiing] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [message, setMessage] = React.useState({});
  const [userEmail, setUserEmail] = React.useState(null);
  const history = useHistory();

  React.useEffect(() => {
    if (loggedIn) {
      setIsLoading(true);
      Promise.all([api.getInitialUser(), api.getInitialCards()])
        .then(([userData, initialCards]) => {
          //установка данных пользователя
          setCurrentUser(userData);
          setCards(initialCards);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [loggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .getAddLike(card._id)
        .then((newCard) => {
          setCards((prevCards) => {
            return prevCards.map((c) => (c._id === card._id ? newCard : c));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .getRemoveLike(card._id)
        .then((newCard) => {
          setCards((prevCards) => {
            return prevCards.map((c) => (c._id === card._id ? newCard : c));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleImageClick() {
    setIsImagePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(data) {
    setIsConfirmatiing(true);
    api
      .getChangeUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsConfirmatiing(false));
  }

  function handleUpdateAvatar(link) {
    setIsConfirmatiing(true);
    api
      .getChangeAvatar(link)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsConfirmatiing(false));
  }

  function handleAddPlaceSubmit(cardItem) {
    setIsConfirmatiing(true);
    api
      .getNewCard(cardItem)
      .then((newCardItem) => {
        setCards([newCardItem, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsConfirmatiing(false));
  }

  function handleCardDelete(card) {
    setIsConfirmatiing(true);
    api
      .getDeleteCard(card._id)
      .then(() => {
        setCards((prevCards) => {
          return prevCards.filter((c) => c._id !== card._id);
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsConfirmatiing(false));
  }

  function handleConfirmDelete(card) {
    setSelectedCard(card);
  }

  function handleTrashClick() {
    setIsConfirmDeleteCard(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
    setIsConfirmDeleteCard(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleRegister(password, email) {
    auth
      .register(password, email)
      .then((res) => {
        if (res) {
          setMessage({
            imgInfo: Ok,
            text: "Вы успешно зарегистрировались!",
          });
          history.push("/sign-in");
        }
      })
      .catch(
        setMessage({
          imgInfo: Err,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        })
      )
      .finally(() => setIsInfoTooltipPopupOpen(true));
  }

  function handleLogin(password, email) {
    auth
      .login(password, email)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setUserEmail(email);
          setLoggedIn(true);
          history.push("/");
        } else {
          setMessage({
            imgInfo: Err,
            text: "Что-то пошло не так! Попробуйте ещё раз.",
          });
          setIsInfoTooltipPopupOpen(true);
        }
      })
      .catch((err) => console.log(err));
  }

  function handlTokenCheck() {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      if (token) {
        auth
          .tokenValid(token)
          .then((res) => {
            if (res) {
              setLoggedIn(true);
              setUserEmail(res.data.email);
              history.push("/");
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/sign-in");
  }

  React.useEffect(() => {
    handlTokenCheck();
  }, []);
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onSignOut={handleSignOut} userEmail={userEmail} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onImageClick={handleImageClick}
            cards={cards}
            onCardClickLike={handleCardLike}
            onCardDelete={handleConfirmDelete}
            onTrashClick={handleTrashClick}
            isLoading={isLoading}
          />
          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
            <InfoTooltip
              isOpen={isInfoTooltipPopupOpen}
              onClose={closeAllPopups}
              imgInfo={message.imgInfo}
              textInfo={message.text}
            />
          </Route>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
            <InfoTooltip
              isOpen={isInfoTooltipPopupOpen}
              onClose={closeAllPopups}
              imgInfo={message.imgInfo}
              textInfo={message.text}
            />
          </Route>
          <Route path="*">
            <Redirect to={loggedIn ? "/" : "/sign-in"} />
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isConfirm={isConfirmating}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isConfirm={isConfirmating}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isConfirm={isConfirmating}
        />
        <ConfirmationPopup
          isOpen={isConfirmDeleteCard}
          onClose={closeAllPopups}
          onConfirmDelete={handleCardDelete}
          card={selectedCard}
          isConfirm={isConfirmating}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
