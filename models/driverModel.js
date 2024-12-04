const mongoose = require('mongoose');
const slugify = require('slugify');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    slug: String,
    drives: [
      {
        type: String,
        enum: ['bike', 'car', 'bus', 'truck'],
        required: [true, 'Please select Car or Bus or Truck!'],
      },
    ],
    place: {
      type: String,
      required: [true, 'Please tell us your place!'],
    },
    price: {
      type: Number,
      required: [true, 'Please tell us your Price!'],
    },
    pricePerKm: {
      type: Number,
      required: [true, 'Please tell us your Price/Km!'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    contact: {
      type: Number,
      unique: true,
      required: [true, 'Please tell us your contact!'],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    booked: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

driverSchema.index({ price: 1, rating: -1 });

driverSchema.virtual('review', {
  ref: 'Review',
  foreignField: 'driver',
  localField: '_id',
});

driverSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Driver', driverSchema);
