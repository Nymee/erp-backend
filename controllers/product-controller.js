const Product = require("../models/Product");
const ProductValidator = require("../services/product-validation.service");

const getProducts = async (req, res, next) => {
  const companyId = req.token.company_id;
  if (!companyId) {
    const error = new Error("Company ID missing in token");
    error.status = 401;
    throw error;
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
      const error = new Error("Company ID missing in token");
      error.status = 401;
      throw error;
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

    const product = await Product.findOne({ _id: productId, companyId });
    if (!product) {
      const error = new Error("Product not found or unauthorized.");
      error.status = 404;
      throw error;
    }
    Object.assign(product, req.body);

    await product.save();
    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const companyId = req.token?.company_id;

    if (!product_id || !companyId) {
      const error = new Error(
        "Invalid request. Product ID or company ID missing."
      );
      error.status = 400;
      throw error;
    }

    const deletedProduct = await Product.findOneAndDelete({
      _id: product_id,
      companyId,
    });

    if (!deletedProduct) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Product deleted", product: deletedProduct });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
