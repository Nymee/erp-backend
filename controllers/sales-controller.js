const Sales = require("'../models/Sales");
const {
  validateWithProductData,
  createSalesWorkFlow,
} = require("../services/sales-create-edit.service");

const createSales = async (req, res, next) => {
  try {
    const data = await createSalesWorkFlow(req.body);
    const newSales = new Sales(data);
    const sales = Sales.save(newSales);

    res.status(201).json({ message: "Sales created succesfully", data: sales });
  } catch (err) {
    next(err);
  }
};

const updateSales = async (req, res, next) => {
  try {
    const estimation = await updateSalesWorkFlow(req.body, req.params.sales_id);

    await estimation.save();

    res.status(200).json({
      message: "Sales estimation has been updated successfully",
      data: data.estimation,
    });
  } catch (err) {
    next(err);
  }
};
