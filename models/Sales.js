const mongoose = require("mongoose");

const mongoose = require("mongoose");

const salesOESchema = new mongoose.Schema({});

const salesProductSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    retail_margin: { type: Number, required: true },
    retail_margin_type: { type: String, required: true, enum: ["per", "rup"] },
    discount: { type: Number },
    discount_type: {
      type: String,
      enum: ["per", "rup"],
    },
  },
  { _id: false }
);
