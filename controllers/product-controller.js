const Product = require("../models/Product");
const ProductValidator = require("../services/product-validation.service");

const getProducts = async (req, res, next) => {
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

const createProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const token = req.token;
    const companyId = token.company_id;

    if (!companyId) {
      return new Error();
    }

    const newProduct = new ProductValidator(product);
    const { values } = newProduct.validateProduct();
    if (values) {
      product.min_margin_price = values.min_margin_price;
      product.retail_margin_price = values.retail_margin_price;
      product.discount_amount = values.discount_amount;
      product.discount_price = values.discount_price;
      product.sales_price = values.sales_price;
      product.company_id = companyId;
    }

    const finalProduct = new Product(product);
    await finalProduct.save();
    res.status(201).json({ message: "Product created" });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
    const productId = req.params.product_id;

    const product = Product.findOne({ _id: productId, companyId });
    Object.assign(product, req.body);

    await product.save();
  } catch (err) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {};
