const BaseError = require("./base-error");

class AuthorizationError extends BaseError {
  constructor(message = "Unauthorized") {
    super("Unauthorized", 401, message);
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super("Forbidden", 401, message);
  }
}

module.exports = { AuthorizationError, ForbiddenError };
