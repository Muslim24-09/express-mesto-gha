const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: false, // true если поле должно быть обязательным
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return 0;
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return 0;
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
