class ErrorHandling extends Error {
  // this class is used to handle errors in the application it will replace the error
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // this will not appear in the stack trace
  }
}
module.exports = ErrorHandling;
