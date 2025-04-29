const jwt = require("jsonwebtoken");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      req.user = decoded; // Pass user info to route
      next();
    } catch (err) {
      console.error("Token error:", err);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

module.exports = authorizeRoles;
