// 4) START SERVER
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: './config.txt' });
const app = require('./app');
// console.log(process.env.PASSWORD);
// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
//   rating: 4.7
// });
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR: ', err);
//   });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Server is running on port 3000');
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
