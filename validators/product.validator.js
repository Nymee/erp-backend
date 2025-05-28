const Joi = require("joi");
const Product = require("../models/Product");
const objectIdValidator = require("../utils/object-validator");
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  cost_price: Joi.number().required(),
  retail_margin: Joi.number().required(),
  min_margin: Joi.number().required(),
  max_margin: Joi.number().required(),
  discount: Joi.number().optional(),
  margin_unit: Joi.when("discount", {
    //if discount key is there regardless of value
    is: Joi.exist(),
    then: Joi.string().valid("per", "rup").required(),
    otherwise: Joi.forbidden(),
  }),
  gst: Joi.number().optional(),
  cess: Joi.number().optional(),
  sales_price: Joi.number().required(),
});

const updateProductSchema = Joi.object({
  product_id: objectIdValidator("productId").required(), //this should be in params right
  name: Joi.string().required(),
  cost_price: Joi.number().required(),
  retail_margin: Joi.number().required(),
  min_margin: Joi.number().required(),
  max_margin: Joi.number().required(),
  discount: Joi.number().optional(),
  margin_unit: Joi.string().required(),
  gst: Joi.number().optional(),
  cess: Joi.number().optional(),
  sales_price: Joi.number().required(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
