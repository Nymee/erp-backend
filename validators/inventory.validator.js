const Joi = require("joi");

const createInventorySchema = Joi.object({
  productId: Joi.string().required(),
  supplierId: Joi.string().required(),
  quantity: Joi.number().required(),
  created_date: Joi.number().required(),
});

module.exports = {
  createInventorySchema,
};
