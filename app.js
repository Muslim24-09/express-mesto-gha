const express = require('express');
const mongoose = require('mongoose');

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
app.use((req, _, next) => {
  req.user = {
    _id: '63ac710e2f06bc5fa79b43e6',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.patch('/404', (_, res) => {
  res.status(404).send({ message: '404. Page not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
