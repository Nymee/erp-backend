const Product = require("../models/Product");
const ProductValidator = require("../services/product-validation.service");

const getProducts = async (req, res) => {
  const companyId = req.token.company_id;
  if (!companyId) {
    return new Error();
  }
  try {
    const products = await Product.find({ companyId });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res) => {
  const product = req.body;
  const token = req.token;
  const companyId = token.company_id;

  if (!companyId) {
    return new Error();
  }

  const newProduct = new ProductValidator(product);
  const { error, values } = newProduct.validateProduct();
  if (error) {
    throw new Error(error);
  }
};
