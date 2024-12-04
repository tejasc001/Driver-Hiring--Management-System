const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Driver = require('../models/driverModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../util/catchAsync');
const factory = require('./handleFactory');
const AppError = require('../util/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.params.driverId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.REACT_APP_STATIC}/drivers`,
    cancel_url: `${process.env.REACT_APP_STATIC}/drivers/${driver._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.driverId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          unit_amount: driver.price,
          product_data: {
            name: `${driver.name} Driver`,
            images: [
              `${req.protocol}://${req.get('host')}/public/img/drivers/${
                driver?.photo ? driver.photo : 'default.jpg'
              }`,
            ],
          },
          currency: 'inr',
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });

  createBookingCheckout(session);
});

exports.getMyBookedDrivers = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const driverIDs = bookings.map((el) => el.driver);
  const drivers = await Driver.find({ _id: { $in: driverIDs } });

  res.status(200).json({
    status: 'success',
    drivers,
  });
});

exports.createRefundPayment = async (req, res, next) => {
  const { paymentIntent } = await Booking.findById(req.params.id);
  try {
    const refund = await stripe.refunds.create({
      paymentIntent,
    });
    if (refund.status !== 'succeeded')
      return next(new AppError('Refund cannot possible, Try again later', 402));

    res.status(200).json({
      status: 'success',
      refund,
    });
  } catch (e) {
    return next(
      new AppError(
        'Refunded already or invalid identifier, Try again later',
        400
      )
    );
  }
};

const createBookingCheckout = async (session) => {
  const driver = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total;
  // const paymentIntent = session.payment_intent;
  await Booking.create({
    driver,
    user,
    price,
    // paymentIntent
  });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
