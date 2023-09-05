const Tour = require('./../Models/tourModel'); //  Tour is a collection in the database
const APIFeatures = require('./../util/APIFeatures');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/ErrorHandling');
const factory = require('./handlerFactory');
const User = require('./../Models/userModel');
const sharp = require('sharp');
const multer = require('multer');

// 1) ROUTE HANDLERS
// 2) ROUTE HANDLERS
// exports.checkID = (req, res, next, val) => {
//   const tour = tours.find(el => el.id === +val);
//   // console.log(tour);
//   console.log(`Tour id is: ${val}`);
//   if (!tour) {
//     console.log('Invalid ID');
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// ckeck body middleware
// exports.checkBody = (req, res, next) => {
//   if (req.method === 'POST') {
//     if (!req.body.name || !req.body.price) {
//       console.log('Missing name or price');
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Missing name or price'
//       });
//     }
//   }
//   next();
// };
// req.query -> this.queryString
// query -> this.query

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   //  1A) FILTERING
//   // const queryObj = { ...req.query };
//   // const excluded_fields = ['page', 'sort', 'limit', 'fields'];
//   // excluded_fields.forEach(el => delete queryObj[el]);
//   // // console.log(req.query, queryObj);
//   // //  1B) ADVANCED FILTERING
//   // const queryStr = JSON.stringify(queryObj);
//   // const queryStrWithDollarSign = queryStr.replace(
//   //   /\b(gte|gt|lte|lt)\b/g,
//   //   match => `$${match}`
//   // );
//   // console.log(JSON.parse(queryStrWithDollarSign));
//   // const queryObjWithDollarSign = JSON.parse(queryStrWithDollarSign);
//   // let query = Tour.find(queryObjWithDollarSign); // the query is a query object that is not executed yet in this case it is  after filtering

//   // 2) SORTING
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' '); // sort('price ratingsAverage')
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }
//   // 3) FIELD LIMITING
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' '); // 'name duration price'
//   //   query = query.select(fields); // select('name duration price')
//   // } else {
//   //   query = query.select('-__v');
//   // }
//   // 4) PAGINATION
//   // const page = +req?.query?.page || 1;
//   // const limit = +req?.query?.limit || 100;
//   // const skip = (page - 1) * limit; // page=3& limit=10,( 1-10, page 1), (11-20, page 2),( 21-30, page 3)
//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours) throw new Error('This page does not exist');
//   // }
//   // query = query.skip(skip).limit(limit);
//   /**
//    *  query = query.skip(skip).limit(limit);
//    * is used to implement pagination if there was no page query in the url then the query will be like this: query = query.skip(0).limit(100); as default page=1 and limit=100
//    */
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const toursDocs = await features.query; // execute the query to get the documents from the collection 'Tour'
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: toursDocs.length,
//     data: {
//       tours: toursDocs
//     }
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });

// handle images
const multerStorage = multer.memoryStorage(); // save the image to the memory as a buffer

const multerFilter = (req, file, cb) => {
  // filter the file to make sure it is an image otherwise reject it and send an error
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // if the file is an image
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
// upload.single('image') -> req.file
// upload.array('images', 5) -> req.files
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 }, // the name of the field in the form
  { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next(); // if there is no imageCover or images then skip this middleware

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`; // create a filename for the image
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = []; // create an array of images

  await Promise.all(
    // loop over the images and resize them we use Promise.all because we have an array of promises and we want to wait until all the promises are resolved othrwise we will go to the next middleware before the promises are resolved an the images array will be empty
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`; // create a filename for each image

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
// handle images

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//   // try {
//   const newTourDoc = await Tour.create(req.body); // create a new document in the collection 'Tour'

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTourDoc
//     }
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// exports.getTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   // try {
//   const tourDoc = await Tour.findById(id).populate('reviews'); // get a document from the collection 'Tour' by id
//   if (!tourDoc) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tourDoc
//     }
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: err
//   });
// }
// });

// function if the new tour have array of guides ids
// const getGuides = async ids => {
//   const guidesPromises = ids.map(async id => {
//     return await User.findById(id);
//   });
//   const guides = await Promise.all(guidesPromises);
//   return guides;
// };

exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   // try {
//   // if (req.body.guides) {
//   //   console.log('first', req.body.guides);
//   //   req.body.guides = await getGuides(req.body.guides);
//   //   console.log('second', req.body.guides);
//   // }
//   const tourUpdatedDoc = await Tour.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true
//   }); // update a document from the collection 'Tour' by id
//   if (!tourUpdatedDoc) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tourUpdatedDoc
//     }
//   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   // try {
//   const tour = await Tour.findByIdAndDelete(id); // delete a document from the collection 'Tour' by id
//   console.log(tour);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });
exports.calcStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: stats.length,
    data: {
      tours: stats
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});
exports.getTopMonths = catchAsync(async (req, res, next) => {
  const { year } = req.params;
  // try {
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        ToursNum: { $sum: 1 },
        Tours: { $push: '$name' }
      }
    },
    {
      $sort: {
        ToursNum: 1
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: plan.length,
    data: {
      tours: plan
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // else unit is km

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
