const Joi = require("joi");
const objectIdValidator = require("../utils/object-validator");

const createInvoiceSchema = Joi.object({
  sales_order_id: objectIdValidator("salesOrderId"),
  client_id: objectIdValidator("clientId"),
  products: Joi.array().items(invoiceProductSchema).min(1).required(),
  invoice_total: Joi.number().min(0).required(),
  dispatched_at: Joi.date().optional(), // fallback to Date.now() in controller if not present
});

const invoiceProductSchema = Joi.object({
  product_id: objectIdValidator("productId"),
  dispatched_qty: Joi.number().min(1).required(),
}).unknown(false);
