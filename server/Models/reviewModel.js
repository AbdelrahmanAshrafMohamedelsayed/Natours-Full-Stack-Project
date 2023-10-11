const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have a review'],
      trim: true,
      maxlength: [
        1000,
        'A review must have less or equal than 1000 characters'
      ], // max length of the string
      minlength: [10, 'A review must have more or equal than 10 characters'] // min length of the string
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'], // min value of the number
      max: [5, 'Rating must be below 5.0'], // max value of the number
      required: [true, 'A review must have a rating']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // this field will not be shown in the output of the query to the client (in postman)
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    }
  },

  // options object for the schema virtual property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// for updating the average rating , total number of ratings of a tour after creating a new review
// we will use the statics method of mongoose schema
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // this points to the current model
  // this.aggregate() will return a promise
  const stats = await this.aggregate([
    //  1) match the tour id to only get the reviews of the requested tour
    {
      $match: { tour: tourId }
    },
    // 2) for calculating the average rating and the number of ratings we will use the $group operator to group the documents by the tour id which will return one document containing the statistics we will do
    {
      $group: {
        _id: '$tour', // the field that we want to group by
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]); // this will return an array of objects we will use the first object in the array
  // console.log('stats', stats);
  // 3) update the tour document with the new statistics
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    // this will happen we you entire this function when deleting the last review on this tour
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};
// for preventing duplicate reviews
// we will use the index method of mongoose schema
// a user can only write one review for a tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// for calling the calcAverageRatings function after creating a new review
reviewSchema.post('save', function() {
  // this points to current review
  // this.constructor points to the current model
  this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user', // the field that we want to populate
  //   select: 'name photo' // the fields that we want to exclude from the output
  // }).populate({
  //   path: 'tour', // the field that we want to populate
  //   select: 'name' // the fields that we want to exclude from the output
  // });
  this.populate({
    path: 'user', // the field that we want to populate
    select: 'name photo' // the fields that we want to exclude from the output
  });
  next();
});
// for updating the average rating , total number of ratings of a tour after updating or deleting a review
// we will use the pre query middleware
//  findOneAnd will work for both findByIdAndUpdate and findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // print the current query filter
  // console.log(this.getFilter());
  // const r = await this.findOne(); // this.findOne() will return the document before the update or delete operation
  this.r = await this.findOne(); // this.r will be used in the post query middleware
});
reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema); // create in the database a collection named 'Review' with the schema 'ReviewSchema'
module.exports = Review;
