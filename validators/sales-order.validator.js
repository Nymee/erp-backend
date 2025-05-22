const Joi = require("joi");
const objectIdValidator = require("../utils/object-validator");

const createSalesOrderSchema = Joi.object({
  client_id: objectIdValidator("clientId"),
  products: Joi.array().items(salesProductSchema).required(),
});

const salesProductSchema = Joi.object({});
