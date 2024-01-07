const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFoundError');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;