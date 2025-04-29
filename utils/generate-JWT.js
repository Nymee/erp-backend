const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return token;
};

module.exports = generateJWT;
