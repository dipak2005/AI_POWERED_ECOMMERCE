const Joi = require("joi"); // Use uppercase 'Joi'

const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
});

module.exports = reviewSchema; // Export directly
