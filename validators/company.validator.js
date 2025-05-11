const Joi = require("joi");

const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  email_id: Joi.string().email().required(),
  mobile: Joi.number().required(),

  user_name: Joi.string().required(),
  user_email: Joi.string().email().required(),
  user_mobile: Joi.string().required(),

  isVerified: Joi.string().valid("approve", "pending", "reject").optional(), // optional because default is handled by Mongoose
});

const updateCompanySchema = Joi.object({
  name: Joi.string(),
  email_id: Joi.string().email(),
  mobile: Joi.number(),

  user_name: Joi.string(),
  user_email: Joi.string().email(),
  user_mobile: Joi.string(),

  isVerified: Joi.string().valid("approve", "pending", "reject"),
}).min(1);

const verifyCompany = Joi.object({
  isVerified: Joi.string().valid("approve", "pending", "reject").required(),
});

module.exports = { createCompanySchema, updateCompanySchema, verifyCompany };
