const router = require('express').Router();
const {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validation');

router.post('/', validationCreateCard, createCard);

router.get('/', getCards);

router.put('/:cardId/likes', validationCardId, likeCard);

router.delete('/:cardId/likes', validationCardId, dislikeCard);

router.delete('/:id', validationCardId, deleteCard);

module.exports = router;