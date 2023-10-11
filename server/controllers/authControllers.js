const crypto = require('crypto'); // built-in node module
const { promisify } = require('util'); // built-in node module
const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('./../util/catchAsync');
const ErrorHandling = require('./../util/ErrorHandling');
// const sendEmail = require('./../util/email');
const Email = require('./../util/email');

const signToken = id => {
  // console.log('🔥🔥🔥🔥🔥🔥', process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  }); // create the token
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // const user = await User.create(req.body); // create a new document in the collection 'User' // it's good but not secure

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  }); // create a new document in the collection 'User'
  // create the token and send it to the client and make him login
  // const token = signToken(user._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user
  //   }
  // });

  // send the welcome email
  const url = `${process.env.FRONTEND_URL}/me`;
  // console.log(url);
  await new Email(user, url).sendWelcome();
  // send the welcome email

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥');
  const { email, password } = req.body; // get the email and password from the request body
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandling('Please provide email and password!', 400)); // 400 means bad request
  }
  // 2) Check if user exists && password is correct
  // we need to select the password because it is not selected by default , + means select
  const user = await User.findOne({ email }).select('+password'); // get the user from the database
  // console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥');
  // console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥');
  // console.log(user);
  // 3) If everything ok, send token to client
  // const correct = await user.correctPassword(password, user.password); // compare the password from the request body with the password from the database
  // // console.log(correct + ' ' + user);
  // if (!user || !correct) {
  //   return next(new ErrorHandling('Incorrect email or password', 401)); // 401 means unauthorized
  // }
  if (!user || !(await user.correctPassword(password, user.password))) {
    // console.log(password, user?.password);
    // console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥');
    return next(new ErrorHandling('Incorrect email or password', 401)); // 401 means unauthorized
  }
  // console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥');
  // console.log(user);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  // console.log('req.headers', req.body);
  // 1) Getting token and check if it's there
  let token;
  // console.log('req.headers', req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // get the token from the request header
    // console.log('token', token);
  }
  if (!token) {
    return next(
      new ErrorHandling(
        'You are not logged in! Please log in to get access.',
        401
      )
    ); // 401 means unauthorized
  }
  // 2) Verification token
  // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // verify the token

  // if we reach this line, it means that the token is valid otherwise an error will be thrown and we will go to the error handling middleware

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id); // get the user from the database
  if (!currentUser) {
    return next(
      new ErrorHandling(
        'The user belonging to this token does no longer exist.',
        401
      )
    ); // 401 means unauthorized
  }
  // 4) Check if user changed password after the token was issued
  // currentUser.passwordChanged(decoded.iat);
  if (currentUser.passwordChanged(decoded.iat)) {
    return next(
      new ErrorHandling(
        'User recently changed password! Please log in again.',
        401
      )
    ); // 401 means unauthorized
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // we can use this user in the next middleware
  // console.log('req.user 💥 💥 💥 💥 💥 💥 💥', req.user);
  next();
});
exports.restrictTo = (...roles) => {
  // we will reach this function after the protect middleware which means that the user is logged in
  // and you will notice that in the protect middleware we set the user in the request object then we can use it here
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // console.log(req.user.role);
      return next(
        new ErrorHandling(
          'You do not have permission to perform this action',
          403
        )
      ); // 403 means forbidden
    }
    next(); // if the user has the permission, we will go to the next middleware
  };
};
// for password reset
// we have 2 functions for password reset
// 1. forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body; // get the email from the request body
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email }); // get the user from the database
  if (!user) {
    return next(new ErrorHandling('There is no user with email address.', 404)); // 404 means not found
  }
  // 2) Generate the random reset token
  const resetToken = user.passwordGenerateResetToken(); // generate the reset token
  await user.save({ validateBeforeSave: false }); // save the user in the database
  // 3) Send it to user's email

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`; // create the message

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    // });
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // create the reset url
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandling(
        'There was an error sending the email. Try again later!'
      ),
      500
    );
  }
});
// 2. resetPassword
exports.resetPassword = catchAsync(async (req, res, next) => {
  // console.log('resssssssssssssssssser');
  // 1) Get user based on the token
  const { token } = req.params; // get the token from the request parameters
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex'); // encrypt the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() } // check if the token is not expired
  }); // get the user from the database
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorHandling('Token is invalid or has expired', 400)); // 400 means bad request
  }
  user.password = req.body.password; // set the new password
  user.passwordConfirm = req.body.passwordConfirm; // set the new password confirm
  user.passwordResetToken = undefined; // delete the password reset token
  user.passwordResetExpires = undefined; // delete the password reset expires
  // we can here update the passwordChangedAt property but we will not do that because we already have a middleware pre save that will do that for us
  await user.save(); // save the user in the database we don't need to use validateBeforeSave:false because we need to validate the password and password confirm like length and match
  // we use save instead of update because we need to run the validators and the pre save middleware

  // 3) Update changedPasswordAt property for the user
  // done in the pre save middleware
  // 4) Log the user in, send JWT
  // const tokenLogin = signToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   tokenLogin
  // });
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  // console.log(req.body);
  const { _id: id } = req.user; // destructuring
  const user = await User.findById(id).select('+password');
  // if(!user){
  // } // no need he should have been loged in already
  // console.log(user + 'upppppppppppppp');
  //2) check if the current password is correct
  const {
    currentPassword,
    password: newPassword,
    passwordConfirm: passwordNewConfirm
  } = req.body;
  // console.log(req.body);
  // if (currentPassword !== user.password) {
  //   return next(new ErrorHandling('Your current password is wrong.', 401));
  // }
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new ErrorHandling('Your current password is wrong.', 401));
  }
  //3) update password
  user.password = newPassword; // set the new password
  user.passwordConfirm = passwordNewConfirm; // set the new password confirm
  await user.save(); // save the user in the database we don't need to use validateBeforeSave:false because we need to validate the password and password confirm like length and match
  // after update we need update userChange password but it is done in  pre save middle were

  // 4) login

  // const tokenLogin = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   tokenLogin
  // });
  createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
