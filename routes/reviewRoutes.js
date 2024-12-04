const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.notRestrictTo('user'),
    reviewController.setDriverUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.notRestrictTo('user'), reviewController.updateReview)
  .delete(authController.notRestrictTo('user'), reviewController.deleteReview);

module.exports = router;
