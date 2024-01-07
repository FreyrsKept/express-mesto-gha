const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
}

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFound('Передан несуществующий _id карточки');
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      if (err.message === 'NotFound') {
        next(new NotFound('Передан несуществующий _id карточки'));
      }
      next(err);
    });
}

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFound('Передан несуществующий _id карточки');
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
      }
      if (err.message === 'NotFound') {
        next(new NotFound('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      } else {
        throw new ForbiddenError('В доступе отказано');
      }
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};