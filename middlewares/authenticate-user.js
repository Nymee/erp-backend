const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/errors/custom-error");

const authenticateUser = (req, res, next) => {
  console.log("🔐 Authentication middleware triggered");
  console.log("📋 Request headers:", req.headers);
  
  const authHeader = req.headers.authorization;
  console.log("🎫 Auth header:", authHeader);
  
  if (!authHeader) {
    console.log("❌ No authorization header found");
    return next(new AuthorizationError("Unauthorized: No token provided"));
  }
  
  if (!authHeader.startsWith("Bearer ")) {
    console.log("❌ Authorization header doesn't start with 'Bearer '");
    console.log("🔍 Header value:", JSON.stringify(authHeader));
    return next(new AuthorizationError("Unauthorized: Invalid authorization format"));
  }
  
  const token = authHeader.split(" ")[1];
  console.log("🪙 Extracted token:", token ? token.substring(0, 20) + "..." : "null");
  
  try {
    console.log("🔑 JWT_SECRET_KEY exists:", !!process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("✅ Token decoded successfully:", decoded);
    req.token = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return next(new AuthorizationError("Unauthorized: Invalid token"));
  }
};

module.exports = authenticateUser;