const jwt = require('jsonwebtoken');
const AuthError = require('../errors/autherror');

module.exports = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = autorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'yandex-prakticum');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};