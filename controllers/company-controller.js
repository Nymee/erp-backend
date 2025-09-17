const Company = require("../models/Company");
const sendMail = require("../utils/email-service");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Branch = require("../models/Branch");
const { buildFilter } = require("../utils/filter-builder");

const verifyCompany = async (req, res) => {
  try {
    const { isVerified } = req.body;
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

    company.isVerified = isVerified;

    await company.save();

    if (isVerified === "approved") {
      const branch = await Branch.create({
        name: "Head Office",
        companyId: company._id,
      });

      // await sendMail({
      //   to: company.email_id,
      //   subject: "Company Approved",
      //   text: `Hello ${company.name}, your company has been approved!`,
      // });

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      await User.create({
        name: company.user_name,
        email: company.user_email,
        mobile: company.user_mobile,
        role: "SAU",
        password: hashedPassword,
        temp_password: tempPassword,
        branchId: branch._id,
        companyId: company._id,
      });

      // await sendMail({
      //   to: company.user_email,
      //   subject: "Login Details - ERP",
      //   text: `Your account has been created.\nEmail: ${company.user_email}\nTemporary Password: ${tempPassword}`,
      // });
    }

    res.status(200).json({ message: `Company ${isVerified} successfully.` });
  } catch (err) {
    console.error("Error in verifyCompany:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCompanies = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      order = "asc",
      orderBy = "name",
      search = "",
      isVerified = "approved",
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = buildFilter({
      search,
      fields: ["name", "email", "address"],
      baseFilter: { isVerified },
    });

    const companies = await Company.find(filter)
      .sort({ [orderBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Company.countDocuments(filter);

    const data = {
      data: companies,
      total: total,
    };

    console.log(`Fetched ${companies.length} companies from DB`);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCompanies };

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
