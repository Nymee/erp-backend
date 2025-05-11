const Joi = require("joi");
const { objectIdValidator } = require("../utils/validators");

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),

  role: Joi.string().valid("SAU", "SE", "MG", "ADMIN").default("SAU"),

  password: Joi.string().required(),

  branchId: objectIdValidator("branchId").required(),
  companyId: objectIdValidator("companyId").required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),

  role: Joi.string().valid("SAU", "SE", "MG", "ADMIN").default("SAU"),

  password: Joi.string().required(),

  branchId: objectIdValidator("branchId").required(),
  companyId: objectIdValidator("companyId").required(),
});

module.exports = createUserSchema;
