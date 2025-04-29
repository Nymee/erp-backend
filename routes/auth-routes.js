const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateUser = require("../middlewares/authenticate-user");

const router = express.Router();

router.post("/sign-up", authController.signupCompany);
router.post("/login-in", authController.loginCompany);
router.post("");

module.exports = router;
