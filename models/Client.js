const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
