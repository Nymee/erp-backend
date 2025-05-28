const Sales = require("'../models/Sales");
const {
  validateWithProductData,
  validateWithSalesData,
} = require("../services/sales-validation.service");

const createSales = async (req, res, next) => {
  try {
    const salesInfo = req.body;
    const salesProducts = req.body.products;
    const value = validateWithProductData(salesProducts);
  } catch (err) {
    next(err);
  }
};

const updateSales = async (req, res, next) => {
  try {
    const salesInfo = req.body;
    const salesId = req.params.sales_id;
    const salesProducts = salesInfo.products;
    const price_update = salesInfo.price_update;

    const estimationInfo = await Sales.findById(salesId).lean();
    if (!estimationInfo) {
      throw new Error("Estimation not found.");
    }
    const estProds = estimationInfo.products;
    const { added: newProducts, updated } = diffProducts(
      estimationInfo.products,
      salesProducts
    );
    const existingProducts = updated.map((u) => u.to);
    const newProdResult = await validateWithProductData(salesProducts);

    if (price_update) result = await validateWithProductData(existingProducts);
    else result = await validateWithSalesData(salesProducts, estProds);

    if (value) {
    }
  } catch (err) {}
};
