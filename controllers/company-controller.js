const Company = require("../models/company");
const sendMail = require("../utils/email-service");
const User = require("../models/user");

const verifyCompany = async (req, res) => {
  try {
    const { verified } = req.body; //verified can be approved  or rejected
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company)
      return res.status(404).json({ message: "Company does not exist" });

    if (company.isVerified !== "pending") {
      return res
        .status(400)
        .json({ message: "Company has already been updated" });
    }

    if (!["approve", "rejected"].includes(verified)) {
      return res
        .status(400)
        .json({ message: "verified status can only be approved or rejected" });
    }

    company.isVerified = verified;
    await company.save();

    if (company.isVerified == "approve") {
      await sendMail({
        to: company.email,
        subject: "Company Approved",
        text: `Hello ${company.name}, your company has been approved!`,
      });

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

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
  } catch (err) {
    console.error("Error in verifyCompany:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies", error });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company", error });
  }

  const updateCompany = (req, res) => {
    try {
      const { id } = req.params.id;

      const company = Company.findById(id);
      if (!company) return res.status(400).json({ message: "No such company" });
      Object.assign(company, req.body);
      company.save();
    } catch (error) {}
  };
};

module.exports = { verifyCompany };
