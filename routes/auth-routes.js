const express = require("express");
const authController = require("../controllers/auth-controller");
const verifyUser = require("../middlewares/verify-user");
const validate = require("../validators/company.validator");
const authenticateUser = require("../middlewares/authenticate-user");

const router = express.Router();

router.post(
  "/sign-up",
  validate(createCompanySchema),
  authController.signupCompany
);
router.post("/login-in", verifyUser, authController.loginCompany);

module.exports = router;
