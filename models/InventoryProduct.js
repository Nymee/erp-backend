const mongoose = require("mongoose");

const inventoryProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
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
