const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:driverId',
  authController.notRestrictTo('admin', 'user'),
  bookingController.getCheckoutSession
  // bookingController.createBookingCheckout
);

// router.use(authController.notRestrictTo('admin'));

router.get('/myBookings/', bookingController.getMyBookedDrivers);
router.get('/myBookings/:id', bookingController.createRefundPayment);

router
  .route('/')
  .get(authController.notRestrictTo('admin'), bookingController.getAllBookings)
  .post(authController.notRestrictTo('admin'), bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(authController.notRestrictTo('admin'), bookingController.updateBooking)
  .delete(
    authController.notRestrictTo('admin'),
    bookingController.deleteBooking
  );

module.exports = router;
