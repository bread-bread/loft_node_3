const joi = require('@hapi/joi');

const authSchema = joi.object({
  username: joi.string().email().required(),
  password: joi.string().min(6).max(12).required()
});

const skillsSchema = joi.object({
  age: joi.number().optional(),
  concerts: joi.number().optional(),
  cities: joi.number().optional(),
  years: joi.number().optional()
});

const productSchema = joi.object({
  file: joi.object({
    mimetype: joi.string().required(),
    path: joi.string().required(),
    destination: joi.string().required()
  }).unknown(true).required(),
  name: joi.string().required(),
  price: joi.number().required()
});

module.exports = {
  authSchema,
  skillsSchema,
  productSchema
}