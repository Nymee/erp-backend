// middleware/validateJWT.js
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE);
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);

// Validates that token is from Auth0 and has correct audience
const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE, // e.g. https://api.salesphere.com
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

// Optional: Extract custom claims middleware
const extractUserInfo = (req, res, next) => {
  console.log(req.auth, "MLAAAAAAAAAAAAAAAAAAAAAAAAAA");
  
  // The decoded token is in req.auth.payload, not req.auth directly
  const payload = req.auth.payload;
  
  req.token = {
    auth0Id: payload.sub,
    role: payload["https://api.salesphere.com/role"],
    companyId: payload["https://api.salesphere.com/companyId"],
    branchId: payload["https://api.salesphere.com/branchId"],
  };
  
  console.log(req.token, "H;LAAAAAAAAAAAAAAAAAAA");
  next();
};

module.exports = { validateJWT, extractUserInfo };
