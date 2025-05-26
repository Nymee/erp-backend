const Joi = require("joi");
const objectIdValidator = require("../utils/object-validator");

const salesProductSchema = Joi.object({
  product_id: objectIdValidator("productId"),
  quantity: Joi.number().required(),
  retail_margin: Joi.number().required(),
  retail_margin_type: Joi.string().required(),
  discount: Joi.number().optional(),
  discount_type: Joi.string().optional(),
})
  .unknown(false)
  .and("discount", "discount_type")
  .custom((value, helpers) => {
    const hasDiscount = value.discount != null;
    const hasType = value.discount_type != null;

    if (hasDiscount !== hasType) {
      return helpers.error("any.invalid", {
        message:
          "'discount' and 'discount_type' must both be provided or both be omitted",
      });
    }
    return value;
  });

const createSOESchema = Joi.object({
  client_id: objectIdValidator("clientId"),
  products: Joi.array().items(salesProductSchema).required(),
  so_discount: Joi.number().optional(),
  so_discount_type: Joi.number().optional(),
  type: Joi.string().valid("order", "estimation").required(),
})
  .and("so_discount", "so_discount_type")
  .custom((value, helpers) => {
    const hasDiscount = value.so_discount != null;
    const hasType = value.so_discount_type != null;

    if (hasDiscount !== hasType) {
      return helpers.error("any.invalid", {
        message:
          "'so_discount' and 'so_discount_type' must both be provided or both be omitted",
      });
    }

    return value;
  });

const updateSOE = Joi.object({
  products: Joi.array().items(salesProductSchema).optional(),
  so_discount: Joi.number().optional(),
  so_discount_type: Joi.number().optional(),
  type: Joi.string().valid("order", "estimation").optional(),
})
  .unknown(false)
  .custom((value, helpers) => {
    const hasDiscount = value.so_discount != null;
    const hasType = value.so_discount_type != null;

    if (hasDiscount !== hasType) {
      return helpers.error("any.invalid", {
        message:
          "'so_discount' and 'so_discount_type' must both be provided or both be omitted",
      });
    }

    return value;
  });
