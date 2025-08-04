const express = require("express");
const authController = require("../controllers/auth-controller");
const verifyUser = require("../middlewares/verify-user");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();

router.post(
  "/sign-up",
  authController.signupCompany
);
router.post("/login", verifyUser, authController.loginCompany);

module.exports = router;
