const express = require('express');
const { validateGetUser, validateUpdateUserInfo, validateUpdateAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

const userRouter = express.Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.get('/users/:userId', validateGetUser, getUser);
userRouter.patch('/users/me', validateUpdateUserInfo, updateUserInfo);
userRouter.patch('/users/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
