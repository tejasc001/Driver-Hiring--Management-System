const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');
const driverRoutes = require('./routes/driverRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// app.use('/api', limiter);
app.use(cors());

app.enable('trust proxy');
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ['price', 'place', 'rating'],
  })
);

// app.use('/', viewRoutes);
app.use('/api/v1/driver', driverRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/booking', bookingRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
