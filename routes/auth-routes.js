const express = require("express");
const authController = require("../controllers/auth-controller");
const verifyUser = require("../middlewares/verify-user");

const router = express.Router();

router.post("/sign-up", authController.signupCompany);
router.post("/login-in", verifyUser, authController.loginCompany);

module.exports = router;
