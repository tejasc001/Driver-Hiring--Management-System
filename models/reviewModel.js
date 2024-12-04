const mongoose = require('mongoose');
const Driver = require('./driverModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: 'Driver',
      required: [true, 'Review must belong to a driver.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ driver: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({ path: 'driver', select: 'name photo place' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (driverId) {
  const stats = await this.aggregate([
    {
      $match: { driver: driverId },
    },
    {
      $group: {
        _id: '$driver',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Driver.findByIdAndUpdate(driverId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating,
    });
  } else {
    await Driver.findByIdAndUpdate(driverId, {
      ratingsQuantity: 0,
      rating: 4.0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.driver);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.driver);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
