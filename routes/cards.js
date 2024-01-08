const express = require('express');
const { validateCreateCard, validateUpdateCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

const cardRouter = express.Router();
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validateCreateCard, createCard);
cardRouter.delete('/cards/:cardId', validateUpdateCard, deleteCard);
cardRouter.put('/cards/:cardId/likes', validateUpdateCard, setLike);
cardRouter.delete('/cards/:cardId/likes', validateUpdateCard, removeLike);

module.exports = cardRouter;