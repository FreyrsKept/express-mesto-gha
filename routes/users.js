const router = require('express').Router();
const {
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
} = require('../controllers/users');

router.get('/', getUsersInfo);
router.get('/:id', getUserInfo);

router.patch('/me', setUserInfo);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;