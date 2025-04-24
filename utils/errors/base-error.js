class BaseError extends Error {
  constructor(name, statusCode, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    // Error.captureStackTrace(this, this.constructor);                            //we'll come back to this later since the concept was a bit too complicated.
  }
}

module.exports = BaseError;
