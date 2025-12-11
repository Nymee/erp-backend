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
    const companyId = req.token.companyId;

    // ✅ OPTIMIZED: Run workflow and client fetch in parallel (was: sequential)
    const [data, client] = await Promise.all([
      createSalesWorkFlow(req.body),
      Client.findById(req.body.clientId).lean()
    ]);

    // Validate client exists
    if (!client) {
      const error = new Error(`Client with ID ${req.body.clientId} not found`);
      error.status = 404;
      throw error;
    }

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
    const companyId = req.token.companyId;
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
    const companyId = req.token.companyId;
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

const getSalesById = async (req, res, next) => {
  const companyId = req.token.companyId;
  if (!companyId) {
    return res.status(401).json({ error: "Company ID missing in token" });
  }

  try {
    const data = await Sales.findById(req.params.sales_id);

    if (!data) {
      throw new error("Data not found");
    }

    res.status(200).json({ data: data });
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
  getSalesById,
};
