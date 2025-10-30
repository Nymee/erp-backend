const express = require("express");
const authenticateUser = require("../middlewares/authenticate-user");
const router = express.Router();
const {
  createSales,
  updateSales,
  dispatchProducts,
  getSalesProducts,
  getSales,
  getSalesById,
} = require("../controllers/sales-controller");
const validator = require("../middlewares/validator");
const {
  createSOESchema,
  updateSOE,
} = require("../validators/sales-order.validator");

router.post("/dispatch", authenticateUser, dispatchProducts);
router.post("/", authenticateUser, validator(createSOESchema), createSales);
router.get("/product", authenticateUser, getSalesProducts);
router.get("/", authenticateUser, getSales);
router.get("/:sales_id", authenticateUser, getSalesById);

router.put("/:sales_id", authenticateUser, updateSales);

module.exports = router;
