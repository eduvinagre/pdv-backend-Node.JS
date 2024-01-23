const knex = require("../conection");
const orderSchema = require("../validations/orderSchema");
const { sendMail } = require("../services/mailtransporter");

const create = async (req, res) => {
  try {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    const { error } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const customerExists = await knex("clientes")
      .where({ id: cliente_id })
      .first();
    if (!customerExists) {
      return res.status(400).json({ message: "Customer not found." });
    }

    let totalOrderValue = 0;
    let productExists;

    for (const produto of pedido_produtos) {
      productExists = await knex("produtos")
        .where({ id: produto.produto_id })
        .first();
      if (!productExists) {
        return res.status(400).json({
          message: `Product with ID ${produto.produto_id} not found.`,
        });
      }

      if (produto.quantidade_produto > productExists.quantidade_estoque) {
        return res.status(400).json({
          message: `Insufficient quantity in stock for product with ID ${produto.produto_id}.`,
        });
      }

      await knex("produtos")
        .where({ id: produto.produto_id })
        .update({
          quantidade_estoque:
            productExists.quantidade_estoque - produto.quantidade_produto,
        });

      const productValue = productExists.valor * produto.quantidade_produto;
      totalOrderValue += productValue;
    }

    const insertedOrder = await knex("pedidos")
      .insert({
        cliente_id,
        observacao,
        valor_total: totalOrderValue,
      })
      .returning(["id"]);

    for (const produto of pedido_produtos) {
      await knex("pedido_produtos").insert({
        pedido_id: insertedOrder[0].id,
        produto_id: produto.produto_id,
        quantidade_produto: produto.quantidade_produto,
        valor_produto: productExists.valor * produto.quantidade_produto,
      });
    }

    const customer = await knex("clientes").where({ id: cliente_id }).first();
    const customerEmail = customer.email;
    const mailText = `<h1>Dear ${customer.nome} your order was placed successfully!</h1>
    <p><img src="https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z5bf4eedbcd13cc4485b50f1c_f1060d6ee875e20a0_d20231117_m073318_c005_v0501010_t0006_u01700206398753" style="width: 300px;"</p>`;

    await sendMail(customerEmail, "Order Placed", mailText);

    return res.status(201).json({ id: insertedOrder[0].id });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Unable to register the order." });
  }
};

const list = async (req, res) => {
  try {
    const { cliente_id } = req.query;

    let query = knex("pedidos as p")
      .select(
        "p.id as pedido_id",
        "p.valor_total",
        "p.observacao",
        "p.cliente_id"
      )
      .leftJoin("pedido_produtos as pp", "p.id", "pp.pedido_id")
      .select(
        "pp.id as produto_id",
        "pp.quantidade_produto",
        "pp.valor_produto",
        "pp.produto_id"
      );

    if (cliente_id) {
      query = query.where("p.cliente_id", cliente_id);
    }

    const results = await query;

    const orders = [];
    let currentOrderId = null;
    let currentOrder = null;

    results.forEach((row) => {
      if (row.pedido_id !== currentOrderId) {
        if (currentOrder) {
          orders.push(currentOrder);
        }

        currentOrderId = row.pedido_id;
        currentOrder = {
          pedido: {
            id: row.pedido_id,
            valor_total: row.valor_total,
            observacao: row.observacao,
            cliente_id: row.cliente_id,
          },
          pedido_produtos: [],
        };
      }

      if (row.produto_id) {
        currentOrder.pedido_produtos.push({
          id: row.produto_id,
          quantidade_produto: row.quantidade_produto,
          valor_produto: row.valor_produto,
          pedido_id: row.pedido_id,
          produto_id: row.produto_id,
        });
      }
    });

    if (currentOrder) {
      orders.push(currentOrder);
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  list,
};
