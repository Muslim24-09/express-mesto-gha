// models/user.js
const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);
