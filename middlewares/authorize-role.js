// middlewares/authorizeRoles.js
const { ForbiddenError } = require("../utils/errors/custom-error");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError("Forbidden: No user context"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("Forbidden: Insufficient role"));
    }

    next();
  };
};

module.exports = authorizeRoles;
