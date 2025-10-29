const Client = require("../models/Client");
const Sales = require("../models/Sales");
const { getSalesProductList } = require("../services/product-service");
const {
  createSalesWorkFlow,
  updateSalesWorkflow,
} = require("../services/sales-create-edit.service");
const { v4: uuidv4 } = require("uuid");
const { getSalesList } = require("../services/sales-service");

const createSales = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;

    const data = await createSalesWorkFlow(req.body);
    const client = await Client.findById(req.body.clientId).lean();
    const orderNumber = `SO-${uuidv4().slice(0, 8).toUpperCase()}`; // e.g., SO-4F7A9B1C

    const newSales = new Sales({
      ...data,
      companyId,
      client_name: client.name,
      order_no: orderNumber,
    });
    const sales = await newSales.save();

    res
      .status(201)
      .json({ message: "Sales created successfully", data: sales });
  } catch (err) {
    next(err);
  }
};

const getSales = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
    if (!companyId) {
      return res.status(401).json({ error: "Company ID missing in token" });
    }
    const { page, limit, order, orderBy, search, type } = req.query;
    const result = await getSalesList({
      companyId,
      page,
      limit,
      order,
      orderBy,
      search,
      type,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getSalesProducts = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
    if (!companyId) {
      return res.status(401).json({ error: "Company ID missing in token" });
    }

    const { page, limit, order, orderBy, search } = req.query;

    const result = await getSalesProductList({
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

const updateSales = async (req, res, next) => {
  console.log("heheheheh");
  try {
    const estimation = await updateSalesWorkflow(req.body, req.params.sales_id);
    console.log("heheheheh", estimation);

    await estimation.save();

    res.status(200).json({
      message: "Sales estimation has been updated successfully",
      data: estimation,
    });
  } catch (err) {
    next(err);
  }
};

const dispatchProducts = async (req, res, next) => {
  try {
    const invoice = await dispatchProductsFlow(req.body);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSales,
  updateSales,
  dispatchProducts,
  getSalesProducts,
  getSales,
};
