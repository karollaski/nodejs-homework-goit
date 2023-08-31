const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.base": "E-mail must be a string",
    "string.email": "Enter a valid e-mail address",
    "any.required": "E-mail is required",
  }),
  password: Joi.string()
    .pattern(/[A-Za-z]/, "Password must contain at least one letter")
    .pattern(/\d/, "Password must contain at least one number")
    .min(8)
    .trim()
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must contain at least 8 characters",
      "any.required": "Password is required",
    }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .trim()
    // .required()
    .messages({
      "string.base": "Subscription must be a string",
      "any.required": "Missing field subscription",
      "any.only":
        "Subscription must be one of these values - [starter, pro, business]",
    }),
});

module.exports = schema;
