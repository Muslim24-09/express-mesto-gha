const express = require('express');
const mongoose = require('mongoose');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.patch('/404', (_, res) => {
  res.status(404).send({ message: '404. Page not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
