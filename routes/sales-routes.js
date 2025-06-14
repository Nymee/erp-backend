const express = require("express");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();

router.post("/dispatch", authenticateUser, dispatchProducts);

module.exports = router;
