const Company = require("../models/Company");
const sendMail = require("../utils/email-service");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Verify Company
const verifyCompany = async (req, res) => {
  try {
    const { verified } = req.body; // "approved" or "rejected"
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company does not exist" });
    }

    if (company.isVerified !== "pending") {
      return res
        .status(400)
        .json({ message: "Company has already been updated" });
    }

    company.isVerified = verified;
    await company.save();

    if (verified === "approved") {
      await sendMail({
        to: company.email,
        subject: "Company Approved",
        text: `Hello ${company.name}, your company has been approved!`,
      });

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      await User.create({
        name: company.user_name,
        email: company.user_email,
        mobile: company.user_mobile,
        role: "SAU",
        password: hashedPassword,
      });

      await sendMail({
        to: company.user_email,
        subject: "Login Details - ERP",
        text: `Your account has been created.\nEmail: ${company.user_email}\nTemporary Password: ${tempPassword}`,
      });
    }

    res.status(200).json({ message: `Company ${verified} successfully.` });
  } catch (err) {
    console.error("Error in verifyCompany:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies", error });
  }
};

// Get Company By ID
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      const error = new Error("No such company");
      error.status = 404;
      throw error;
    }
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

// Update Company
const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      const error = new Error("No such company");
      error.status = 404;
      throw error;
    }

    Object.assign(company, req.body);
    await company.save();
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};
