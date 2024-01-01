const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

function createUser(req, res, next) {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      user.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
}

function getUsersInfo(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
}

function getUserInfo(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
}

function setUserInfo(req, res) {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
}

function setUserAvatar(req, res) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'yandex-praktikum', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ERROR_NOT_FOUND('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  login,
  getCurrentUser,
};