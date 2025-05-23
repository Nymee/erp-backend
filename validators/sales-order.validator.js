const Joi = require("joi");
const objectIdValidator = require("../utils/object-validator");

const createSOESchema = Joi.object({
  client_id: objectIdValidator("clientId"),
  products: Joi.array().items(salesProductSchema).required(),
  so_discount: Joi.number().optional(),
  so_discount_type: Joi.number().optional(),
  type: Joi.string().valid("order", "estimation").required,
}).and("so_discount", "so_discount_type");

const updateSOE = Joi.object({
  products: Joi.array().items(salesProductSchema).optional(),
  so_discount: Joi.number().optional(),
  so_discount_type: Joi.number().optional(),
  type: Joi.string().valid("order", "estimation").optional(),
}).unknown(false);

const salesProductSchema = Joi.object({
  quantity: Joi.number().required(),
  retail_margin: Joi.number().required(),
  retail_margin_type: Joi.string().required(),
  discount: Joi.number().optional(),
  discount_type: Joi.string().optional(),
})
  .unknown(false)
  .and("discount", "discount_type");
