const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    company: user.companyId,
  };

  if (user.companyId) {
    payload.company = user.companyId;
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

module.exports = generateJWT;
