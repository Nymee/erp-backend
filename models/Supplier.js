const mongoose = require("mongoose");
const Branch = require("./Branch");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
