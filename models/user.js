const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  REG_URL,
  DEFAULT_NAME,
  DEFAULT_ABOUT,
  DEFAULT_AVATAR_URL,
} = require('../config/config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: DEFAULT_NAME,
    minlength: [2, 'Имя не может быть короче 2 символов'],
    maxlength: [30, 'Имя не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    default: DEFAULT_ABOUT,
    minlength: [2, 'Информация о себе не может быть короче 2 символов'],
    maxlength: [30, 'Информация о себе не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR_URL,
    validate: {
      validator(url) {
        return REG_URL.test(url);
      },
      message: 'Неверно указан URL аватара',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверно указана почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
