const {
  ForbiddenError,
  AuthorizationError,
} = require("../utils/errors/custom-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ForbiddenError || err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      message: err.message || "Access Denied",
      error: err.name,
    });
  }

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: err.message, error: "Validation Error" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid Data Format",
      details: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate Key Error",
      details: `Duplicate value found for field: ${Object.keys(
        err.keyValue
      ).join(", ")}`,
    });
  }

  if (err.name === "ProductValidationError") {
    return res.status(400).json({
      message: err.message,
      error: "Product Validation Error",
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Something went wrong. Please try again later.",
      error: err.name,
    });
  }

  if (err.status == 500) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
