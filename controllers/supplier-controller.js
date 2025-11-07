const Supplier = require("../models/Supplier");
const { getSupplierList } = require("../services/supplier-service");
const getSuppliers = async (req, res, next) => {
  try {
    const companyId = req.token.companyId;
    if (!companyId) {
      return res.status(401).json({ error: "Company ID missing in token" });
    }

    const { page, limit, order, orderBy, search, dropdown } = req.query;

    result = await getSupplierList({
      companyId,
      page,
      limit,
      order,
      orderBy,
      search,
      dropdown,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.supplier_id);
    if (!supplier) {
      const error = new Error("No such supplier");
      error.status = 404;
      throw error;
    }
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { supplier_id } = req.params;
    const supplier = await Supplier.findById(supplier_id);

    if (!supplier) {
      const error = new Error("No such supplier");
      error.status = 404;
      throw error;
    }

    Object.assign(supplier, req.body);
    await supplier.save();
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = new Supplier({
      ...req.body,
      companyId: req.token.companyId,
      branchId: req.token.branchId,
    });
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  updateSupplier,
  createSupplier,
};
