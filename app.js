const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { login, createUser, unAuthorized } = require('./controllers/users');
const regExp = require('./constants/constants');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const MONGO_URL = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URL);
const app = express();

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// для теста без авторизации
app.post('/signout', unAuthorized);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use('*', (_, __, next) => next(new NotFoundError('Страница не найдена')));

app.use((err, _, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  }
  next();
});

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
