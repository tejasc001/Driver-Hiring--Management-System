const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: 'Driver',
      required: [true, 'Booking must belong to a Driver!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    // paymentIntent: {
    //   type: String,
    //   required: [true, 'Booking must have payment Intent'],
    // },
    price: {
      type: Number,
      required: [true, 'Booking must have a price.'],
    },
    bookedDate: {
      start: Date,
      end: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.index({ driver: 1, user: 1 }, { unique: true });

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'driver',
    select: '-__v -slug',
  }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
