const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
