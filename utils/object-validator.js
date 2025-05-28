const mongoose = require("mongoose");
const Joi = require("joi");

const objectIdValidator = (label = "value") =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message(`"${label}" must be a valid ObjectId`);
    }
    return value;
  }, "ObjectId validation");

module.exports = objectIdValidator;
