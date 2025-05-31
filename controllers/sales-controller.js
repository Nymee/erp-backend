const Sales = require("../models/Sales");
const {
  createSalesWorkFlow,
  updateSalesWorkflow,
} = require("../services/sales-create-edit.service");

const createSales = async (req, res, next) => {
  try {
    const data = await createSalesWorkFlow(req.body);
    const newSales = new Sales(data);
    const sales = await newSales.save();

    res
      .status(201)
      .json({ message: "Sales created successfully", data: sales });
  } catch (err) {
    next(err);
  }
};

const updateSales = async (req, res, next) => {
  try {
    const estimation = await updateSalesWorkflow(req.body, req.params.sales_id);

    await estimation.save();

    res.status(200).json({
      message: "Sales estimation has been updated successfully",
      data: estimation,
    });
  } catch (err) {
    next(err);
  }
};
