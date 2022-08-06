const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const DuplicateConflictError = require('../utils/errors/DuplicateConflictError');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/goodcodes');

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((data) => {
      res.status(CREATE_CODE).send({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        _id: data._id,
        email: data.email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Данные не прошли валидацию на сервере'));
      } else if (error.code === 11000) {
        next(new DuplicateConflictError('Указанный email давно отдыхает в базе данных, используйте другой email :)'));
      } else {
        next(error);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch(next);
};

module.exports.getUsersId = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Неверно указан id пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      res.status(CORRECT_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Неверно указан id пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports.patchUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Данные не прошли валидацию на сервере'));
      } else {
        next(error);
      }
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ id: userId }, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Данные не прошли валидацию на сервере'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(CORRECT_CODE).send({ token });
    })
    .catch(next);
};
