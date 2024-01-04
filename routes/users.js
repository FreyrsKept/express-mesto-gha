const router = require('express').Router();
const {
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/validation');

router.get('/', getUsersInfo);
router.get('/:id', validationUserId, getUserInfo);
router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, setUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, setUserAvatar);

module.exports = router;