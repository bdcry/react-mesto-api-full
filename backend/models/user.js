const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationError = require('../utils/errors/AuthorizationError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // строка
      minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
      maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
      default: 'Жак-Ив Кусто', // значение по умолчанию
    },
    about: {
      type: String, // строка
      minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
      maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
      default: 'Исследователь', // значение по умолчанию
    },
    avatar: {
      type: String, // строка
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', // значение по умолчанию
      validate: {
        validator(v) {
          return /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            v,
          );
        },
        message: 'Ошибка. Ссылка не подходит для установки на аватар :(',
      },
    },
    email: {
      type: String, // строка
      required: [true, 'Это обязательное поле'], // обязательное поле
      unique: true, // так в базе не окажется несколько пользователей с одинаковой почтой
      validate: {

        validator(v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} не является email`,
      },
    },
    password: {
      type: String, // строка
      required: [true, 'Это обязательное поле'], // обязательное поле
      select: false, // исключаем возврат хеш пароля из базы
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function func(email, password) {
  return this.findOne({ email })
    .select('+password') // скрываем пароль
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(
          'Похоже, что почта или пароль некорректные!',
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError(
            'Похоже, что почта или пароль некорректные!',
          );
        }

        return user;
      });
    });
};
module.exports = mongoose.model('User', userSchema);
