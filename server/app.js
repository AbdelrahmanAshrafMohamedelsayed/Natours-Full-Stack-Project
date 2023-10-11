const fs = require('fs');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const morgan = require('morgan');
const express = require('express');
const helmet = require('helmet');
const ErrorHandling = require('./util/ErrorHandling');
const compression = require('compression');
const cors = require('cors');
const ErrorHandlingFunc = require('./controllers/errorControllers');

// const corsOptions = {
//   origin: '*',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200
// };
const app = express();
// app.use(cors(corsOptions));
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

app.use(cors());
// walid
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, DELETE, OPTIONS'
//   );
//   next();
// });
// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
// 1) should be the first middleware to include the security headers
app.options('*', cors());
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // console.log('producgbfgffgtion');
} else {
  // console.log('production');
}
// Limit requests from same API (IP)
// const limiter = rateLimit({
//   max: 100, // 100 requests per hour
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: 'Too many requests from this IP, please try again in an hour!' // error message
// });
// app.use('/api', limiter); // apply the limiter middleware to all routes starting with /api

// Body parser, reading data from body into req.body (limit the size of the body to 10kb) (prevent DOS attacks) (prevent sending huge payload to the server)
app.use(express.json({ limit: '10kb' })); // here we read the data from the body and parse it to json and put it in req.body
//  we need to clean the data in the body from any malicious code (prevent NoSQL injection)
// then we need to clean the data from any malicious html code (prevent XSS attacks)
//  we need data sanitization against parameter pollution (prevent duplicate query strings)
// Data sanitization against NoSQL query injection
/**
 * how nosql injection works:
 * he can login with the following credentials:
 * email: {"$gt": ""} (this will return all the users in the database) becuase this always return true
 * any password exisits in the database
 * you will find the user has logged in successfully with the email and password
 */
app.use(mongoSanitize());
// what mongoSanitize does is that it will look at the req.body, req.queryString, req.params and filter out all the $ and the . from the data

// Data sanitization against XSS
/*
 * how XSS works: when the user sends a malicious html code in the body of the request
 * and the server will send back the malicious html code to the client and the client will execute the malicious code
 */
app.use(xss());
//  what xss does is that it will look at the req.body, req.queryString, req.params and filter out all the html code
// for example if the user sends the following in the body of the request:
// <script>alert('hello world')</script>
// the server will send back the following to the client:
// &lt;script&gt;alert('hello world')&lt;/script&gt;
//  prevent parameter pollution
//  we need to whitelist the parameters that we want to allow to be duplicated in the query string
//  for example if we want to allow the user to filter the tours by duration and ratingsAverage
//  we need to whitelist these parameters
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });
app.use(compression()); // compress all the text that is sent to the client (html, css, js, json, etc...) not images

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
// 4) Handling Unhandled Routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  next(new ErrorHandling(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 5) Error Handling Middleware
app.use(ErrorHandlingFunc);
// 1. status 204 no content for delete request success
// 2. status 201 created for post request success
// 3. status 200 ok for get request success
// 4. status 404 not found for get request fail (wrong url) or  ((wrong id))
// 5. status 400 bad request for post request fail
// 6. status 500 internal server error for server error
// 7. status 401 forbidden for unauthorized access (wrong token) or (wrong password) or (wrong email)
module.exports = app;
