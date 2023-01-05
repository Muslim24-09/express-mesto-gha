const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch((err) => res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` }));
  // ! Исправить коды ошибок на 401 при неправильных почте или пароле
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` }));
};

const getUsers = (_, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(400).send({ message: 'Запрашиваемые пользователи не найдены' });
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` }));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
        next(err);
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
        next(err);
      } else {
        res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
        next(err);
      } else if (err.name === 'MongoError' || err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
        next(err);
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message} ` });
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
        next(err);
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
        next(err);
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message} ` });
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
      }
      res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
