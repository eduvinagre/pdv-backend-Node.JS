const Joi = require("joi");

const productsSchema = Joi.object({
  descricao: Joi.string().required(),
  quantidade_estoque: Joi.number().min(0).required(),
  valor: Joi.number().min(0.01).required(),
  categoria_id: Joi.number().required(),
});

module.exports = productsSchema;
