const router = require('express').Router(); // создали роутер

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.get('/:userId', getUserById);

router.get('/', getUsers);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
