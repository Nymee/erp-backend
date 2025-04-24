const express = require("express");
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/sign-up", authController.signupCompany);
router.post("/login-in", authController.loginCompany);

module.exports = router;
