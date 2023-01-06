const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const regExp = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const MONGO_URL = 'mongodb://localhost:27017/mestodb';

mongoose.set('strictQuery', false);
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(MONGO_URL, () => {
  console.log('Connected to MongoDB');
  // опции больше не поддерживаются
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// app.use('/users', auth, require('./routes/users'));
// app.use('/cards', auth, require('./routes/cards'));

app.patch('/404', (_, res) => {
  res.status(404).send({ message: '404. Page not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
