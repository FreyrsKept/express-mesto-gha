const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const { URL_REGEX } = require('../utils/constants');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Жак-Ив Кусто',
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
    },
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Информация о пользователе должна быть длиной от 2 до 30 символов',
    },
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => URL_REGEX.test(url),
      message: 'Требуется ввести URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => /.+@.+\..+/.test(email),
      message: 'Требуется ввести электронный адрес',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: ({ length }) => length >= 6,
      message: 'пароль должен состоять минимум из 6 символов'
    },
  },
}, {
  versionKey: false,
  statics: {
    findUserByCredentials(email, password) {
      return this
        .findOne({ email })
        .select('+password')
        .then((user) => {
          if (user) {
            return bcrypt.compare(password, user.password)
              .then((matched) => {
                if (matched) return user;
                return Promise.reject();
              });
          }
          return Promise.reject();
        });
    },
  },
},
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);