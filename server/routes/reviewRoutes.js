const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const authController = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authController.protect); // protect all routes after this middleware (only logged in users can access these routes)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'), // only users can create reviews
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/userReviews')
  .get(authController.protect, reviewController.getUserReviews);

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getReview);
//
module.exports = router;
