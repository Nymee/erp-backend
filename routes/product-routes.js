const express = require("express");
const router = express.Router();
const { productValidationSchema } = require("../validators/product.validator");
const validate = require("../middlewares/validator");

router.post("/products", validate(productValidationSchema));
