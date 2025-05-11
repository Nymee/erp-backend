// middlewares/authenticateUser.js
const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/errors/custom-error");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthorizationError("Unauthorized: No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    return next(new AuthorizationError("Unauthorized: Invalid token"));
  }
};

module.exports = authenticateUser;
