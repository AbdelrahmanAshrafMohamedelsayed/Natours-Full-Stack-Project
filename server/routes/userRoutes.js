const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup); // signup
userRouter.post('/login', authController.login); // login
userRouter.post('/logout', authController.logout);

userRouter.post('/forgotPassword', authController.forgotPassword); // forgot password
userRouter.patch('/resetPassword/:token', authController.resetPassword); // reset password

// Protect all routes after this middleware to be accessed only by logged in users
userRouter.use(authController.protect);

userRouter.route('/me').get(userController.getMe, userController.getUser); // get the current user
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
); // update user
userRouter.delete('/deleteMe', userController.deleteMe); // delete user
userRouter.patch('/updateMyPassword', authController.updatePassword); // update password

userRouter.use(authController.restrictTo('admin')); // restrict all routes after this middleware to admin only

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
