const express = require("express");
const router = express.Router();
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");
const validate = require("../middlewares/validator");
const authenticateUser = require("../middlewares/authenticate-user");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");

router.get("/", getProducts);
router.post(
  "/",
  authenticateUser,
  validate(createProductSchema),
  createProduct
);
router.patch(
  "/:product_id",
  authenticateUser,
  validate(updateProductSchema),
  updateProduct
);
router.delete("/:product_id", deleteProduct);

module.exports = router;
