const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');

const regExp = require('../constants/constants');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExp),
  }),
}), updateAvatar);

module.exports = router;
