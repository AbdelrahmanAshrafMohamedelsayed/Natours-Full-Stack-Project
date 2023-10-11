const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../Models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../util/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // Specify the payment mode
    payment_method_types: ['card'], // card is the only way to pay as it's the only one supported by stripe free account
    success_url: `${process.env.FRONTEND_URL}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`, // this is the url that the user will be redirected to after successful payment
    cancel_url: `${process.env.FRONTEND_URL}/tour/${req.params.tourId}`, // this is the url that the user will be redirected to after failed payment
    customer_email: req.user.email, // this is the email of the user that will be used to send the email to
    client_reference_id: req.params.tourId, // this is the id of the tour that will be used to create the booking
    // line_items: [
    //   // this is the data that will be displayed to the user in the stripe payment page
    //   {
    //     name: `${tour.name} Tour`, // this is the name of the tour that will be displayed to the user in the stripe payment page
    //     description: tour.summary,
    //     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // this is the image of the tour that will be displayed to the user in the stripe payment page
    //     amount: tour.price * 100, // this is the price of the tour that will be displayed to the user in the stripe payment page * 100 because stripe uses cents
    //     currency: 'usd',
    //     quantity: 1
    //   }
    // ]
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100 // Amount in cents
        },
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  // const { tour, user, price } = req.query;

  // if (!tour && !user && !price) return next();
  // await Booking.create(req.body);
  const bookedTour = await Booking.create(req.body);
  res.status(200).json({
    status: 'success',
    bookedTour
  });
});

exports.getBookingToursOfUser = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } }); // $in is a mongoose operator that selects the documents where the value of a field equals any value in the specified array
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours
  });
});
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
