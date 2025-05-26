const express = require("express");
const router = express.Router();
const { productValidationSchema } = require("../validators/product.validator");
const validate = require("../middlewares/validator");
const authenticateUser = require("../middlewares/authenticate-user");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../routes/product-routes");

router.get("/products", authenticateUser, getProducts);
router.post(
  "/products",
  authenticateUser,
  validate(productValidationSchema),
  createProduct
);
router.patch(
  "/products/:product_id",
  authenticateUser,
  validate(productValidationSchema),
  updateProduct
);
router.delete("/products/:product_id", authenticateUser, deleteProduct);

module.exports = router;
