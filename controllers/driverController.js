const Driver = require('./../models/driverModel');
const User = require('./../models/userModel');
const factory = require('./handleFactory');

exports.getAllDriver = factory.getAll(Driver);
exports.getOneDriver = factory.getOne(Driver, 'review');
exports.createDriver = factory.createOne(Driver, User);
exports.updateDriver = factory.updateOne(Driver);
exports.deleteDriver = factory.deleteOne(Driver);
