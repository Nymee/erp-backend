const Joi = require("joi");

const verifyCompanySchema = Joi.object({
  verified: Joi.string().valid("approved", "rejected").required(),
});

const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  email_id: Joi.string().email().required(),
  mobile: Joi.number().required(),

  user_name: Joi.string().required(),
  user_email: Joi.string().email().required(),
  user_mobile: Joi.string().required(),
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

module.exports = {
  verifyCompanySchema,
  createCompanySchema,
  updateCompanySchema,
};
