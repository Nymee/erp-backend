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
    let result;
    if (price_update) result = await validateWithProductData(salesProducts);
    else result = await validateWithSalesData(salesProducts, salesId);

    if (value) {
    }
  } catch (err) {}
};
