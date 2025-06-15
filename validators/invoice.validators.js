const Joi = require("joi");
const objectIdValidator = require("../utils/object-validator");

const createInvoiceSchema = Joi.object({
  sales_order_id: objectIdValidator("salesId"),
  client_id: objectIdValidator("clientId"),
  products: Joi.array().items(invoiceProductSchema).min(1).required(),
  total_amount: Joi.number().min(0).required(),
  dispatched_at: Joi.date().optional(), // fallback to Date.now() in controller if not present
});

const invoiceProductSchema = Joi.object({
  product_id: objectIdValidator("productId"),
  quantity: Joi.number().min(1).required(),
}).unknown(false);
