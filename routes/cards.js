const router = require('express').Router(); // создали роутер

const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.delete('/:cardId', deleteCardById);

router.get('/', getCards);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
