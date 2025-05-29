const Sales = require("'../models/Sales");
const {
  validateWithProductData,
  validateWithSalesData,
  calculateGrandTotal,
  calculateSODiscountAmount,
} = require("../services/sales-create-edit.service");

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
    const data = updateSalesWorkFlow(req.body, req.params.sales_id);
  } catch (err) {}
};
