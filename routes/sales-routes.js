const express = require("express");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();
const {createSales, updateSales, dispatchProducts} = require("../controllers/sales-controller");
const validator = require("../middlewares/validator");
const {createSOESchema,
updateSOE } = require("../validators/sales-order.validator");


router.post("/dispatch", authenticateUser, dispatchProducts);
router.post("/", authenticateUser, validator(createSOESchema), createSales )

module.exports = router;
