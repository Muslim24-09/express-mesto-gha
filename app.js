const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');

const MONGO_URL = 'mongodb://localhost:27017/mestodb';

mongoose.set('strictQuery', false);
const { PORT = 3000 } = process.env;

const app = express();
app.use('/', router);
// app.use('/')

mongoose.connect(MONGO_URL, () => {
  console.log('Connected to MongoDB');
  // опции больше не поддерживаются
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
// app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
