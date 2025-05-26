const express = require("express");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();

router.post("/", authenticateUser, createSales);

module.exports = router;
