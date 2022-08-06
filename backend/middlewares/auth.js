const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовк
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', ''); // извлекаем токен
  let payload;
  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
