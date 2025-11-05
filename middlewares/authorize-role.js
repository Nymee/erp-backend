// middlewares/authorizeRoles.js
const { ForbiddenError } = require("../utils/errors/custom-error");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.token) {
      return next(new ForbiddenError("Forbidden: No user context"));
    }

    if (!allowedRoles.includes(req.token.role)) {
      return next(new ForbiddenError("Forbidden: Insufficient role"));
    }

    next();
  };
};

module.exports = authorizeRoles;
