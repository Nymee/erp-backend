const mongoose = require("mongoose");
const Branch = require("./Branch");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
