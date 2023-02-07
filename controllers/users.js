const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
              next(new BadRequestError('Неправильно набран логин или пароль'));
            } else next(err);
          });
      } else {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .catch((err) => next(err));
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
      // .send({ message: 'Успешная авторизация' });
      return res.send({ token });
    })
    .catch((err) => next(err));
};

// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // if (!email || !password) {
//       //   next(new UnauthorizedError('Ошибка авторизации'));
//       // }
//       const token = jwt.sign(
//         { _id: user._id },
//         NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
//         { expiresIn: '7d' },
//       );
//       return res
//         .send({ token });
//     })
//     .catch(next);
// };

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
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
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Неправильно введен тип id'));
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
        next(new BadRequestError('Неправильно набран логин или пароль'));
      } else if (err.kind === 'ObjectId') {
        next(new BadRequestError('Ошибка в типе ключа'));
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
        next(new BadRequestError('Введены неверные данные'));
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
    .send({ message: 'Успешнo разлогинились' });
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
