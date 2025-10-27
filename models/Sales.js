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
    cost_price: { type: Number, required: true },
  },
  { _id: false }
);

const salesSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  client_name: { type: String, required: true },
  products: { type: [salesProductSchema], required: true },
  so_discount: { type: Number, required: true },
  so_discount_type: { type: String, required: true },
  type: { type: String, enum: ["order", "estimation"], required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  grand_total_before_so_discount: { type: Number, required: true },
  so_discount_amount: { type: Number, required: true },
  grand_total: { type: Number, required: true },
  order_no: { type: String, required: true },
});

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
