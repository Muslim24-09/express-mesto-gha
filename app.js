const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');
const { login, createUser, unAuthorized } = require('./controllers/users');
const regExp = require('./constants/constants');

const MONGO_URL = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URL, () => {
  console.log('Connected to MongoDB');
  // опции больше не поддерживаются
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// для теста без авторизации
app.post('/signout', unAuthorized);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// app.use('/users', auth, require('./routes/users'));
// app.use('/cards', auth, require('./routes/cards'));

app.patch('/404', (_, res) => {
  res.status(404).send({ message: '404. Page not found' });
});

// app.use((err, req, res, next) => {
//   if (err.status) {
//     res.status(err.status).send(err.message);
//     return;
//   }
//   res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
//   next();
// });
app.use((err, _, res, next) => {
  const { statusCode = 500, message = 'Server error' } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
