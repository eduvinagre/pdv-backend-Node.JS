const jwt = require("jsonwebtoken");
const knex = require("../conection");
const customerSchema = require("../validations/customerSchema");

const save = async (req, res) => {
  try {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
      req.body;

    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const emailExists = await knex("clientes").where({ email }).first();
    if (emailExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const cpfExists = await knex("clientes").where({ cpf }).first();
    if (cpfExists) {
      return res.status(400).json({ message: "CPF is already in use." });
    }

    const insertedCustomer = await knex("clientes").insert({
      nome,
      email,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    });

    return res.status(201).json({ id: insertedCustomer[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
      req.body;
    const { id } = req.params;

    const existingCustomer = await knex("clientes").where({ id }).first();
    if (!existingCustomer) {
      return res.status(404).json({ mensagem: "Customer not found." });
    }

    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const clientWithSameEmail = await knex("clientes")
      .where({ email })
      .whereNot({ id })
      .first();

    if (clientWithSameEmail) {
      return res.status(400).json({
        message: "The email provided already belongs to another customer.",
      });
    }

    const cpfDuplicity = await knex("clientes")
      .where({ cpf })
      .whereNot({ id })
      .first();

    if (cpfDuplicity) {
      return res.status(400).json({
        message: "The CPF has already been provided.",
      });
    }

    const updatedCustomer = await knex("clientes")
      .update({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .where({ id })
      .returning(["id", "nome", "email"]);

    return res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ mensagem: "Não foi possível atualizar o cliente." });
  }
};

const detail = async (req, res) => {
  const { id } = req.params;

  try {
    if (!Number(id)) {
      return res
        .status(400)
        .json({ mensagem: "Rout parameter needs to be a number!" });
    }

    const client = await knex("clientes").where({ id }).first();

    if (!client) {
      return res.status(404).json({ mensagem: "Client does not exist!" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const list = async (req, res) => {
  try {
    const clients = await knex("clientes");
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  save,
  update,
  detail,
  list,
};
