const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/errors/custom-error");

const authenticateUser = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(new AuthorizationError("Unauthorized: No token provided"));
  }
  
  if (!authHeader.startsWith("Bearer ")) {
    return next(new AuthorizationError("Unauthorized: Invalid authorization format"));
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.token = decoded;
    next();
  } catch (err) {
    return next(new AuthorizationError("Unauthorized: Invalid token"));
  }
};

module.exports = authenticateUser;