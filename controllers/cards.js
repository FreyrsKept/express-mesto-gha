const Card = require('../models/card');

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

function getCards(req, res) {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании карточки' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
}

function likeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для добавления лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
}

function dislikeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// function deleteCard(req, res) {
//   const { id } = req.params;

//   Card
//     .findByIdAndRemove(id)
//     .then((card) => {
//       if (card) return res.send({ data: card });

//       return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
//     })
//     .catch((err) => (
//       err.name === 'CastError'
//         ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' })
//         : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
//     ));
// }

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};