module.exports = fn => {
  // this id for async functions that have a catch block and we don't want to repeat the catch block in every async function
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};
