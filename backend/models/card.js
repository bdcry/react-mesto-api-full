const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
    minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
  },
  link: {
    type: String, // строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => /(http:\/\/|https:\/\/)(www)*[a-z0-9\S]*/.test(v),
      message: 'Cсылка не подходит :(',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId
    required: [true, 'Это обязательное поле'], // обязательное поле
    ref: 'user', // ссылка на модель автора карточки
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // ObjectId
    default: [], // пустой массив
    ref: 'user', // ссылка на модель автора карточки
  }],
  createdAt: {
    type: Date, // дата
    default: Date.now(), // значение по умолчанию
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
