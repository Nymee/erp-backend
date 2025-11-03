import { auth } from 'express-oauth2-jwt-bearer';

export const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});
