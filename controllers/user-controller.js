const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;

    if (!companyId) {
      return new Error();
    }

    const users = await User.find({ companyId });
    res.status(200).json(users);
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
    console.log(user_id);
    const user = await User.findById(user_id);

    if (!user) {
      const error = new Error("No such user");
      error.status = 404;
      throw error;
    }

    Object.assign(user, req.body);
    console.log(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    console.log(req.token);
    const tempPassword = Math.random().toString(36).slice(-8);
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
