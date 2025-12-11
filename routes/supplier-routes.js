const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/authorize-role");
const validate = require("../middlewares/validator");
const {
  createSupplierSchema,
  updateSupplierSchema,
} = require("../validators/supplier.validator");

router.get(
  "/",
  validate(createSupplierSchema),
  supplierController.getSuppliers
);
router.post(
  "/",
  validate(updateSupplierSchema),
  authorizeRoles("SAU"),
  supplierController.createSupplier
);
router.get(
  "/:supplier_id",
  supplierController.getSupplierById
);
router.patch(
  "/:supplier_id",
  supplierController.updateSupplier
);

module.exports = router;
