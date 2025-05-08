const express = require("express");
const Company = require("../models/Company");
const bycrypt = require("bcrypt");
const generateJWT = require("../utils/generate-JWT");

const signupCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body); //this is a combination of new Company and company.save()
    res.status(201).json({ message: "Company created succesfully", company });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      return res.status(409).json({
        message: "Duplicate field value",
        field: Object.keys(error.keyValue),
      });
    } else
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again later." });
  }
};

const loginCompany = async (req, res) => {
  const user = req.user;
  if (user) {
    const token = generateJWT(user);
  }
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { signupCompany, loginCompany };
