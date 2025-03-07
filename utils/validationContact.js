const Joi = require("joi");

const customMessages = {
  name: {
    "string.pattern.base": "the 'name' field must only contain letters",
  },
  phone: {
    "string.pattern.base": "the 'phone' field must only contain numbers",
  },
};

const schema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages(customMessages.name),
  email: Joi.string().email().trim().required().messages({
    "string.base": "E-mail must be a string",
    "string.email": "Enter a valid e-mail address",
    "any.required": "E-mail is required",
  }),
  phone: Joi.string()
    .min(3)
    .max(16)
    .trim()
    .required()
    .messages(customMessages.phone),
  favorite: Joi.boolean(),
});

module.exports = schema;
