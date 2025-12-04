const User = require("../models/User");
const bcrypt = require("bcrypt");
const { buildFilter } = require("../utils/filter-builder");
const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_M2M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
});

const getUsers = async (req, res, next) => {
  try {
    const companyId = req.token.companyId;
    if (!companyId) {
      throw new Error();
    }

    let {
      page = 1,
      limit = 10,
      order = "asc",
      orderBy = "name",
      search = "",
    } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = buildFilter({
      search,
      fields: ["name", "email", "mobile"],
      baseFilter: { companyId },
    });

    // Run query and count in parallel (was: sequential)
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ [orderBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    console.log(`Fetched ${users.length} users from DB`);

    const data = {
      data: users,
      total: total,
    };
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      const error = new Error("No such user");
      error.status = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);

    if (!user) {
      const error = new Error("No such user");
      error.status = 404;
      throw error;
    }

    Object.assign(user, req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    // 1️⃣ CREATE USER IN AUTH0 (no password) - must succeed first
    const auth0User = await management.users.create({
      email: req.body.email,
      connection: "Username-Password-Authentication",
      email_verified: false,
      name: req.body.name,
    });

    // 2️⃣ CREATE USER OBJECT
    const user = new User({
      auth0Id: auth0User.user_id,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
      companyId: req.token.companyId,
      branchId: req.token.branchId,
    });

    // ✅ OPTIMIZED: Run ticket generation + MongoDB save in parallel (was: sequential)
    const [ticket, savedUser] = await Promise.all([
      management.tickets.changePassword({
        user_id: auth0User.user_id,
        result_url: "https://your-frontend.com/login",
      }),
      user.save(),
    ]);

    // 4️⃣ SEND EMAIL WITH PASSWORD SETUP LINK
    // You can send this link via your own mail service (SES/SendGrid)
    // or let Auth0 send it automatically (Auth0 usually sends it by default).
    // If you prefer to send it yourself:
    // await sendMail({
    //   to: req.body.email,
    //   subject: "Set up your account password",
    //   text: `Welcome! Click here to set your password: ${ticket.ticket}`
    // });

    res.status(201).json({
      message: "User created successfully. Password setup email sent.",
      user,
    });
    AUTH0;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  createUser,
};
