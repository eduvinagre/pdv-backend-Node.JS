const Joi = require("joi");

const customerSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required(),
  rua: Joi.string().required(),
  numero: Joi.string().required(),
  bairro: Joi.string().required(),
  cidade: Joi.string().required(),
  estado: Joi.string().required(),
});

module.exports = customerSchema;
