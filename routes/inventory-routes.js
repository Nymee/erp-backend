const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/authorize-role");
const validate = require("../middlewares/validator");
const { createInventorySchema } = require("../validators/inventory.validator");

router.get("/", inventoryController.getInventories);
router.post(
  "/",
  validate(createInventorySchema),
  authorizeRoles("SAU"),
  inventoryController.createInventory
);
router.get("/products", inventoryController.getInventoryProducts);
router.get(
  "/products/:inventory_product_id",
  inventoryController.getInventoryProductById
);
router.get("/:inventory_id", inventoryController.getInventoryById);

module.exports = router;
