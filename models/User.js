const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  role: { type: String, enum: ["SAU", "SE", "MG", "ADMIN"], default: "SAU" },
  password: String,
});

exports.module = User;
