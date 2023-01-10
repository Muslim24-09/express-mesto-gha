const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Пользователь с таким логином/паролем не найден' });
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Неправильно набран логин или пароль' });
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
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
    .then(async (hash) => {
      const userAlreadyCreated = await User.findOne(({ email: req.body.email }));
      if (!userAlreadyCreated) {
        await User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }).then((user) => res
          .status(200)
          .send({
            name: user.name,
            about: user.about,
            avatar,
            email: user.email,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new BadRequestError('Неправильно набран логин или пароль');
            } else if (err.name === 'MongoError' || err.code === 11000 || userAlreadyCreated) {
              throw new ConflictError('Пользователь с таким email уже зарегистрирован');
            } else next(err);
          });
      } else {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Запрашиваемые пользователи не найдены');
      }
      res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неправильно набран логин или пароль');
      } else if (err.kind === 'ObjectId') {
        throw new BadRequestError('Неверно указан тип id');
      } else next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неправильно набран логин или пароль');
      } else if (err.kind === 'ObjectId') {
        throw new BadRequestError('Неверно указан тип id');
      } else next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Запрашиваемый пользователь не найден');
      }
      return next(err);
    });
};

const unAuthorized = (_, res) => {
  const token = '';
  res
    .cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    })
    .send({ message: 'Успешнo разлогигились' });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  unAuthorized,
};
