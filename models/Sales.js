const mongoose = require("mongoose");

const salesProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    retail_margin: { type: Number, required: true },
    retail_margin_type: { type: String, required: true, enum: ["per", "rup"] },
    discount: { type: Number, optional: true },
    discount_type: {
      type: String,
      enum: ["per", "rup"],
      optional: true,
    },
    last_refresh: { type: Number, required: true },
    expiry: { type: Number, required: true },
    dispatched_qty: { type: Number, default: 0 },
    fully_dispatched: { type: Boolean, default: false },
  },
  { _id: false }
);

const salesSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  products: { type: [salesProductSchema], required: true },
  so_discount: { type: Number, required: true },
  so_discount_type: { type: String, required: true },
  type: { type: String, enum: ["order", "estimation"], required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
