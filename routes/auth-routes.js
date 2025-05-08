const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const validate = require("../validators/company.validator");

const router = express.Router();

router.post(
  "/sign-up",
  validate(createCompanySchema),
  authController.signupCompany
);
router.post("/login-in", authenticateUser, authController.loginCompany);

module.exports = router;
