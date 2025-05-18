const Joi = require("joi");

const productValidationSchema = Joi.object({
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
  discount_price: Joi.number().required(),
  gst: Joi.number().optional(),
  cess: Joi.number().optional(),
  sales_price: Joi.number().required(),
});

module.exports = {
  productValidationSchema,
};
