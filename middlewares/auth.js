const jwt = require('jsonwebtoken');
const AuthError = require('../errors/autherror');

module.exports = (req, _, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    return next(AuthError('Необходима авторизация'));
  }

  const token = autorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'yandex-prakticum');
  } catch (err) {
    return next(AuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};