import React from "react";
import VectorLogo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

function Header({ onSignOut, userEmail }) {
  const location = useLocation();
  return (
    <header className="header page__header">
      <img src={VectorLogo} alt="Логотип" className="logo page__logo" />
      {location.pathname === "/sign-in" && (
        <Link className="auth__link" to="/sign-up">
          Регистрация
        </Link>
      )}
      {location.pathname === "/sign-up" && (
        <Link className="auth__link" to="/sign-in">
          Войти
        </Link>
      )}
      {location.pathname === "/" && (
        <div>
          <span className="auth__email">{userEmail || ""}</span>
          <Link
            onClick={onSignOut}
            className="auth__link auth__link_signout"
            to="/sign-in">Выйти</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
