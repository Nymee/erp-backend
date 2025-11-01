const Inventory = require("../models/Inventory");
const InventoryProduct = require("../models/InventoryProduct");

const getInventories = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate("productId")
      .populate("supplierId");
    res.status(200).json(inventories);
  } catch (err) {
    next(err);
  }
};

const getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.inventory_id)
      .populate("productId")
      .populate("supplierId");
    if (!inventory) {
      const error = new Error("No such inventory");
      error.status = 404;
      throw error;
    }
    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
};

const createInventory = async (req, res, next) => {
  try {
    const { productId, supplierId, quantity, created_date } = req.body;

    // Create inventory record
    const inventory = new Inventory({
      productId,
      supplierId,
      quantity,
      created_date,
    });
    await inventory.save();

    // Check if productId already exists in InventoryProduct
    let inventoryProduct = await InventoryProduct.findOne({ productId });

    if (inventoryProduct) {
      // Product exists, add quantity
      inventoryProduct.quantity += quantity;

      // Check if updated_date is less than created_date
      if (inventoryProduct.updated_date < created_date) {
        inventoryProduct.updated_date = Math.floor(Date.now() / 1000);
      }

      await inventoryProduct.save();
    } else {
      // Product doesn't exist, create new record
      inventoryProduct = new InventoryProduct({
        productId,
        quantity,
        updated_date: created_date,
      });
      await inventoryProduct.save();
    }

    res.status(201).json(inventory);
  } catch (error) {
    next(error);
  }
};

const getInventoryProducts = async (req, res, next) => {
  try {
    const inventoryProducts = await InventoryProduct.find().populate("productId");
    res.status(200).json(inventoryProducts);
  } catch (err) {
    next(err);
  }
};

const getInventoryProductById = async (req, res, next) => {
  try {
    const inventoryProduct = await InventoryProduct.findById(req.params.inventory_product_id).populate("productId");
    if (!inventoryProduct) {
      const error = new Error("No such inventory product");
      error.status = 404;
      throw error;
    }
    res.status(200).json(inventoryProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventories,
  getInventoryById,
  createInventory,
  getInventoryProducts,
  getInventoryProductById,
};
