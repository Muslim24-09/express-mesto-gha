const User = require('../models/user');

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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message} ` });
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
  createUser,
  updateUser,
  updateAvatar,
};
