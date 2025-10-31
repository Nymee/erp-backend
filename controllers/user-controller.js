const User = require("../models/User");
const bcrypt = require("bcrypt");
const { buildFilter } = require("../utils/filter-builder");

const getUsers = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;
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

    const users = await User.find(filter)
      .sort({ [orderBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(`Fetched ${users} users from DB`);
    const total = await User.countDocuments(filter);

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
    // Generate strong temporary password: 16 chars with uppercase, lowercase, numbers, and special chars
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + special;

    let tempPassword = '';
    // Ensure at least one character from each category
    tempPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    tempPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    tempPassword += numbers[Math.floor(Math.random() * numbers.length)];
    tempPassword += special[Math.floor(Math.random() * special.length)];

    // Fill remaining 12 characters randomly
    for (let i = 0; i < 12; i++) {
      tempPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to randomize character positions
    tempPassword = tempPassword.split('').sort(() => Math.random() - 0.5).join('');

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    let user = new User({
      ...req.body,
      password: hashedPassword,
      temp_password: tempPassword,
      companyId: req.token.company_id,
      branchId: req.token.branch_id,
    });
    await user.save();
    res.status(201).json(user);
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
