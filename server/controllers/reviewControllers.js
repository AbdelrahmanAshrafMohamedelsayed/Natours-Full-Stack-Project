const APIFeatures = require('./../util/APIFeatures');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/ErrorHandling');
const Review = require('./../Models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter1 = {};
//   if (req.params.tourId) filter1 = { tour: req.params.tourId }; // if the url has a tour id then filter the reviews by the tour id
//   const features = new APIFeatures(Review.find(filter1), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const ReviewDocs = await features.query; // execute the query to get the documents from the collection 'Review'
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: ReviewDocs.length,
//     data: {
//       Reviews: ReviewDocs
//     }
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
//   const newReviewDoc = await Review.create(req.body); // create a new document in the collection 'Review'
//   console.log(newReviewDoc);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       Review: newReviewDoc
//     }
//   });
// });
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const ReviewDocs = await features.query; // execute the query to get the documents from the collection 'Review'
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: ReviewDocs.length,
    data: {
      Reviews: ReviewDocs
    }
  });
});
