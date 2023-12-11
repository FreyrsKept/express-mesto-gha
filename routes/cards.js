const router = require('express').Router();
const {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.delete('/:id', deleteCard);

module.exports = router;