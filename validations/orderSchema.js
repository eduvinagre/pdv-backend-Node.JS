const Joi = require("joi");

const orderSchema = Joi.object({
  cliente_id: Joi.number().required(),
  observacao: Joi.string(),
  pedido_produtos: Joi.array().items(
    Joi.object({
      produto_id: Joi.number().required(),
      quantidade_produto: Joi.number().min(1).required(),
    })
  ).required(),
});

module.exports = orderSchema;