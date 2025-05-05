const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  user_name: { type: String, required: true, unique: true },
  user_email: { type: String, required: true, unique: true },
  user_mobile: { type: String, required: true, unique: true },
  isVerified: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending",
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
