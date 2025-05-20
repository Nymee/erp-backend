const express = require("express");
const router = express.Router();
const { productValidationSchema } = require("../validators/product.validator");
const validate = require("../middlewares/validator");
const authenticateUser = require("../middlewares/authenticate-user");

router.get("/products", authenticateUser, validate(productValidationSchema));
router.post("/products", validate(productValidationSchema));
