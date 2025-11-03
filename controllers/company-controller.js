const Company = require("../models/Company");
const sendMail = require("../utils/email-service");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Branch = require("../models/Branch");
const { buildFilter } = require("../utils/filter-builder");
const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_M2M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
});

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
      // 1️⃣ Create default branch
      const branch = await Branch.create({
        name: "Head Office",
        companyId: company._id,
      });

      // 2️⃣ Create user in Auth0 (no password)
      const auth0User = await management.users.create({
        email: company.user_email,
        connection: "Username-Password-Authentication",
        email_verified: false,
        name: company.user_name,
      });

      // 3️⃣ Create password setup (reset) ticket
      const ticket = await management.tickets.changePassword({
        user_id: auth0User.user_id,
        result_url: "https://localhost:5173/login", // redirect after password setup
      });

      // 4️⃣ Save user in MongoDB linked to Auth0
      await User.create({
        auth0Id: auth0User.user_id,
        name: company.user_name,
        email: company.user_email,
        mobile: company.user_mobile,
        role: "SAU",
        branchId: branch._id,
        companyId: company._id,
      });

      console.log(ticket.ticket);
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
