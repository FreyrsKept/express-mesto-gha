const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/AuthError');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Некорректый адрес почты',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Пароль должен состоять минимум из 6 символов',
      },
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },

    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Информация о пользователе должна быть длиной от 2 до 30 символов',
      },
    },

    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => isUrl(url),
        message: 'Некорректный адрес URL',
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
                return Promise.reject(new AuthError('Неправильная почта или пароль'));
              });
          }
          return Promise.reject(new AuthError('Неправильная почта или пароль'));
        });
    },
  },
},
);

module.exports = mongoose.model('user', userSchema);