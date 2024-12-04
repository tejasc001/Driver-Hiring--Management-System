const express = require('express');
const driverController = require('./../controllers/driverController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:driverId/review', reviewRouter);

router.use(authController.protect, authController.notRestrictTo('driver'));

router.route('/createDriver').post(driverController.createDriver);

router
  .route('/:id')
  .get(driverController.getOneDriver)
  .patch(driverController.updateDriver)
  .delete(driverController.deleteDriver);

module.exports = router;
