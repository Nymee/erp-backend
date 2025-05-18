const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cost_price: { type: Number, required: true },
  retail_margin: { type: Number, required: true },
  min_margin: { type: Number, required: true },
  max_margin: { type: Number, required: true },
  discount: { type: Number },
  margin_unit: { type: String, enum: ["per", "rup"] },
  discount_price: { type: Number, required: true },
  gst: { type: Number },
  cess: { type: Number },
  sales_price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
