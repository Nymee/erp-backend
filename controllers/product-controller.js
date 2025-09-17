const Product = require("../models/Product");
const validateProduct = require("../services/product-validation.service");
const { getProductList } = require("../services/product-service");
const getProducts = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
    if (!companyId) {
      return res.status(401).json({ error: "Company ID missing in token" });
    }

    const { page, limit, order, orderBy, search } = req.query;

    const result = await getProductList({
      companyId,
      page,
      limit,
      order,
      orderBy,
      search,
    });

    res.status(200).json(result);
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

    // Attach company ID before validation
    product.companyId = companyId;

    // Run validation and calculations
    const { values } = validateProduct(product, "products");

    // Merge calculated values into product
    const finalData = {
      ...product,
      ...values, // { min_margin_price, retail_margin_price, discount_amount, discount_price, sales_price }
    };

    // Save to DB
    const finalProduct = new Product(finalData);
    await finalProduct.save();

    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
    const productId = req.params.product_id;

    const product = await Product.findOne({ _id: productId, companyId }); //this is a mongoose document object. never overwrite it with a plain object, it will lose its save like functionalities.
    if (!product) {
      const error = new Error("Product not found or unauthorized.");
      error.status = 404;
      throw error;
    }
    Object.assign(product, req.body);
    const values = validateProduct(product.toObject(), "products");
    Object.assign(product, values);
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
