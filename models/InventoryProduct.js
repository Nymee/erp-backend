const mongoose = require("mongoose");

const inventoryProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
      companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
    product_name: {
    type: String,
    required: true,
  },
  supplier_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  updated_date: {
    type: Number,
    required: true,
  },
});

const InventoryProduct = mongoose.model("InventoryProduct", inventoryProductSchema);

module.exports = InventoryProduct;
