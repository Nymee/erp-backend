const express = require("express");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();
const {createSales, updateSales, dispatchProducts, getSalesProducts} = require("../controllers/sales-controller");
const validator = require("../middlewares/validator");
const {createSOESchema,
updateSOE } = require("../validators/sales-order.validator");


router.post("/dispatch", authenticateUser, dispatchProducts);
router.post("/", authenticateUser, validator(createSOESchema), createSales);
router.get("/product", authenticateUser, getSalesProducts);


module.exports = router;
