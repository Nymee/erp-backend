const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  client_id: { type: String, required: true },
  product: { type: [salesProductSchema], required: true },
  so_discount: { type: Number, required: true },
  so_discount_type: { type: String, required: true },
  type: { type: String, enum: ["order", "estimation"], required: true },
});

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
  },
  { _id: false }
);

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
