// 4) START SERVER
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('././../../Models/tourModel');
const User = require('././../../Models/userModel');
const Review = require('././../../Models/reviewModel');

dotenv.config({ path: './config.txt' });
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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const importDataToDB = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); // to validate on password confirm as we not provided password confirm in json file
    await Review.create(reviews);
    console.log('data loaded successfully');
  } catch (err) {
    console.log(err);
  }
  console.log('process.argv');
  process.exit();
};
const deleteDataFromCollection = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('deleted Successfully');
  } catch (err) {
    console.log(err);
  }
  console.log('process.argv');

  process.exit();
};

if (process.argv[2] === '--import') {
  importDataToDB();
} else if (process.argv[2] === '--delete') {
  deleteDataFromCollection();
}
