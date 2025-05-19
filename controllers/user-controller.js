const User = require("'../models/User");

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
    const user = await User.findById(req.params.id);
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
    const { id } = req.params;
    const user = await User.findById(id);

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
    const user = new User(req.body);
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
