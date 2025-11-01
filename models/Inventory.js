const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  created_date: {
    type: Number,
    required: true,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
