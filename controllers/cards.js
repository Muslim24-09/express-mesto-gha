const Card = require('../models/card');

const getCards = (_, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Запрашиваемые карточки не найдены' });
      } else {
        res.status(200).send({ data: cards });
      }
    })
    .catch((err) => res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` }));
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (!req.params.cardId) {
        res.status(400).send({ message: 'Указан неверный id' });
      }
      if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Вы можете удалить только свою карточку!' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else {
        res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else {
        res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else {
        res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Error: ${err} "Переданы некорректные данные"` });
        next(err);
      } else {
        res.status(500).send({ message: `Error ${err} "На сервере произошла ошибка"` });
      }
    });
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
