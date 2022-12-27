const router = require('express').Router(); // создали роутер

const User = require('../models/user');

// const {
//   getUsers,
//   createUser,
//   updateUserProfile,
//   deleteUser
// } = require('./users');

// router.get('/users', getUsers)

// router.get('/users/:id', (req, res) => {
//   // логика обработки начиналась
//   const { id } = req.params;

//   if (!users[id]) {
//     res.send({ error: 'Такого пользователя нет' });
//     return;
//   }

//   // логика обработки заканчивалась, отправлялся ответ
//   res.send(users[id]);
// });

// router.post('/users', )

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание user
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ massage: `Error in send user. Error ${err}` })); // создадим документ на основе пришедших данных
});

router.get('/users/:userId', (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error in get user._id. Error ${err}` }));
});

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Error in get users. Error ${err}` }));
});

module.exports = router;
