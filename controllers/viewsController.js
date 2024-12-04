const Driver = require('../models/driverModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get driver data from collection
  const drivers = await Driver.find();

  // 2) Build template
  // 3) Render that template using driver data from 1)
  res.status(200).render('overview', {
    title: 'All Drivers',
    drivers,
  });
});

exports.getDriver = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested driver (including reviews and guides)
  const driver = await Driver.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
    strictPopulate: false,
  });

  if (!driver) {
    return next(new AppError('There is no driver with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('driver', {
    title: `${driver.name} Driver`,
    driver,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyDrivers = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find drivers with the returned IDs
  const driverIDs = bookings.map((el) => el.driver);
  const drivers = await Driver.find({ _id: { $in: driverIDs } });

  res.status(200).render('overview', {
    title: 'My Drivers',
    drivers,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
