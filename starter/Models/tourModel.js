const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true, // no two tours can have the same name
      trim: true, // remove white spaces at the beginning and at the end of the string
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], // max length of the string
      minlength: [10, 'A tour name must have more or equal than 10 characters'] // min length of the string
      // validate: [validator.isAlpha, 'Tour name must only contain characters'] // validator: only letters are allowed
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum: ['easy', 'medium', 'difficult'] // enum: only these values are allowed
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // min value of the number
      max: [5, 'Rating must be below 5.0'], // max value of the number
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.66666, 47, 4.7
      // set is a function that will run each time a new value is set for this field
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price; // 100 < 200
        },
        message: 'Discount price ({VALUE}) should be below regular price' // {VALUE} is the value of the field
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // this field will not be shown in the output of the query to the client (in postman)
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON is a special format for defining geospatial data from the MongoDB docs
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], // array of numbers
      address: String,
      description: String
    },
    locations: [
      // array of objects
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number], // array of numbers
        address: String,
        description: String,
        day: Number
      }
    ],
    // guides: Array // array of user ids in embbded mode
    guides: [
      // array of user ids in child referencing mode
      {
        type: mongoose.Schema.ObjectId, // this is the type of the id in the user document
        ref: 'User' // this is the name of the model that we want to reference
      }
    ]
  },

  // options object for the schema virtual property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// virtual property
tourSchema.virtual('durationWeeks').get(function() {
  return (this.duration / 7).toFixed(2);
});
// virtual populate the reviews field in the tour document
// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
//  pre save hook used to create not on update
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// // pre save hook to embed the tour guides in the tour document
// tourSchema.pre('save', function(next) {
//   // console.log(this.guides); // this.guides is an array of user ids
//   const users = this.guides.map(async id => {
//     const user = await User.findById(id);
//     console.log('user', user);
//     return await user;
//   });
//   console.log(users);
//   next();
// }); // this will not work because the map function returns an array of promises and not an array of users

// the code below will work
// tourSchema.pre('save', async function(next) {
//   const usersPromises = this.guides.map(async id => {
//     return await User.findById(id);
//   });
//   this.guides = await Promise.all(usersPromises); // this.guides is an array of user documents
//   // promise.all takes an array of promises and returns an array of the resolved values of the promises
//   next();
// }); here we are embedding the user documents in the tour document but this is not a good practice because if the user document is updated we will have to update all the tour documents that have this user as a guide

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE // this middleware will run before any query that starts with 'find'
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } }); // this points to the current query this line will exclude all the secret tours from the output

  this.start = Date.now();
  next();
});
// queryMiddleware for populating the guides field in the tour document
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides', // the field that we want to populate
    select: '-__v -passwordChangedAt' // the fields that we want to exclude from the output
  });
  next();
});
// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   console.log(docs.reviews + 'dghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema); // create in the database a collection named 'Tour' with the schema 'tourSchema'
module.exports = Tour;
