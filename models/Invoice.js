const mongoose = require("mongoose");

const dispatchSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    salesId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Sales",
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number, default: 0 },
    products: { type: [dispatchSchema], required: true },
    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
