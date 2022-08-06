import React from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(state.password, state.email);
  }

  return (
    <div className="auth page__auth">
      <h3 className="auth__title">Регистрация</h3>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          onChange={handleChange}
          value={state.email || ""}
          className="auth__input"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          onChange={handleChange}
          value={state.password || ""}
          className="auth__input"
          name="password"
          type="password"
          placeholder="Пароль"
          required
        />
        <button className="auth__button" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="auth__login">
        Уже зарегистрированы?{" "}
        <Link className="auth__link" to="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
