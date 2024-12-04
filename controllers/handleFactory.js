const AppError = require('./../util/appError');
const APIFeatures = require('./../util/apiFeatures');
const catchAsync = require('./../util/catchAsync');

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No Document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.driverId) filter = { driver: req.params.driverId };

    const totalFilteredDoc = new APIFeatures(
      Model.find(filter),
      req.query
    ).filter();

    const totalDoc = await totalFilteredDoc.query.count();

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(totalDoc);

    const doc = await features.query;

    const { next, prev } = features;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        prev,
        next,
        total: totalDoc,
        data: doc,
      },
    });
  });

exports.createOne = (Model, otherModel) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.user?.role.type === 'driver') {
      req.body.name = req.user.name;
      req.body.photo = req.user.photo;
      req.body.contact = req.user.contact;

      doc = await Model.create(req.body);
    } else {
      doc = await Model.create(req.body);
    }

    if (otherModel) {
      const otherDoc = await otherModel.findOneAndUpdate(
        { contact: req.user.contact },
        { role: { type: 'driver', driverId: doc._id } },
        { new: true, runValidators: true }
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No Document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No Document found with that ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
