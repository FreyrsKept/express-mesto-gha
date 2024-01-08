const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { SECRET_KEY } = require('../config/config');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
