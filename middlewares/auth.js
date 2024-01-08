const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');
const { SECRET_KEY } = require('../config/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
