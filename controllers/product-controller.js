const Product = require("../models/Product");

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
};
