// middleware/validateJWT.js
import { auth } from "express-oauth2-jwt-bearer";

// Validates that token is from Auth0 and has correct audience
export const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE, // https://api.salesphere.com
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

// Optional: Extract custom claims middleware
export const extractUserInfo = (req, res, next) => {
  // Auth0 adds decoded token to req.auth
  // Custom claims will be namespaced: req.auth['https://api.salesphere.com/role']

  req.user = {
    auth0Id: req.auth.sub,
    role: req.auth["https://api.salesphere.com/role"],
    companyId: req.auth["https://api.salesphere.com/companyId"],
    branchId: req.auth["https://api.salesphere.com/branchId"],
  };

  next();
};
