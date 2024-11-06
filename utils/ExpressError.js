class ExpressError extends Error {
    constructor(statusCode, message) {
      super(message); // Pass the message to the parent constructor
      this.statusCode = statusCode;
    }
  }
  module.exports = ExpressError;
  