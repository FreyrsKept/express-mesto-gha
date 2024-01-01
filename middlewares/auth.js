const jwt = require('jsonwebtoken');
const autherror = require('../errors/autherror');

module.exports = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    throw new autherror('Необходима авторизация');
  }

  const token = autorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'yandex-prakticum');
  } catch (err) {
    throw new autherror('Необходима авторизация');
  }

  req.user = payload;
  next();
};