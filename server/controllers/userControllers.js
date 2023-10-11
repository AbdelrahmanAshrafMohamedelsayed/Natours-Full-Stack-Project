const User = require('./../Models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/ErrorHandling');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users'); // cb is like next() in express
//   }, // cb is the callback function
//   filename: (req, file, cb) => {
//     // user-7676767abc-1234567890.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// }); // save the image to the disk we will comment this out later when we will save the image to the memory as a buffer because we will need to resize it

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
exports.uploadUserPhoto = upload.single('photo'); // upload the photo and save it to the req.file as we comment the multerStorage on disk and prevent the file name to be saved to the req.file.filename

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // if there is no file then skip this middleware and go to the next one

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // create a filename for the image

  await sharp(req.file.buffer) // this will make object
    .resize(500, 500) // resize the image
    .toFormat('jpeg') // convert the image to jpeg
    .jpeg({ quality: 90 }) // compress the image by reducing the quality
    .toFile(`public/img/users/${req.file.filename}`); // save the image to the disk

  next();
});

exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find().select('-__v'); // execute the query to get the documents from the collection 'User'
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // add the photo property to the filteredBody object if there is a file
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true, // return the new updated document
    runValidators: true // run the validators again
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  }); // send the response
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Find the user by id and set the active property to false
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

//  no need to implement this route because we don't want to create new users from the this route but from the signup route
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};

exports.getUser = factory.getOne(User);
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined'
//   });
// };

exports.updateUser = factory.updateOne(User); // not updating the password with this route
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined'
//   });
// };

exports.deleteUser = factory.deleteOne(User);
// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined'
//   });
// };
