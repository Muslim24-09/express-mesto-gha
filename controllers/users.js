const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Error: ${err} "Запрашиваемые пользователи не найдены"` }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err} - "Запрашиваемый пользователь не найден"` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err} "Переданы некорректные данные"` }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err} "Переданы некорректные данные"` }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err} "Переданы некорректные данные"` }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
