const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/ErrorHandling');
const APIFeatures = require('./../util/APIFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id); // delete a document from the collection 'document' by id
    // console.log(doc);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const UpdatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }); // update a document from the collection '' by id
    if (!UpdatedDoc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: UpdatedDoc
      }
    });
  });
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // const { id } = req.params;
    let query = Model.findById(req.params.id); // get a document from the collection 'Model' by id
    if (popOptions) query = query.populate(popOptions); // populate the reviews field in the tour document {path: 'reviews'} nice trick
    const doc = await query; // get a document from the collection 'Model' by id
    if (!doc) {
      return next(new AppError('No Document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // print original url
    // console.log({ a: req.originalUrl });
    // console.log(req.ori);
    //  to allow for nested GET reviews on tour (hack)
    // /api/v1/tours/:tourId/reviews
    // this two lines of code will allow us to get all the reviews for a specific tour
    let filter1 = {};
    if (req.params.tourId) filter1 = { tour: req.params.tourId }; // if the url has a tour id then filter the reviews by the tour id

    const features = new APIFeatures(Model.find(filter1), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const Docs = await features.query; // execute the query to get the documents from the collection 'Model'
    // to send the number of pages to the client to be used in the pagination
    const numberOfpages = Math.ceil(
      (await Model.countDocuments()) / (req.query.limit || 100)
    );
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      numberOfpages,
      results: Docs.length,
      data: {
        data: Docs
      }
    });
  });
