const jwt = require("jsonwebtoken");
const {
  AuthorizationError,
  ForbiddenError,
} = require("../utils/errors/custom-error");
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //we return this cause when you call authorizeRoles from the main router call you are actually asking for a middleware function like this.
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthorizationError("Unauthorized: No token provided");
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // object with extra issued at expiry fields

      if (!allowedRoles.includes(decoded.role)) {
        throw new ForbiddenError("Forbidden: Insufficient role");
      }

      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorizeRoles;
