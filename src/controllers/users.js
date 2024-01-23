const bcrypt = require("bcrypt");
const knex = require("../conection");
const { userSchema } = require("../validations/userSchema");

const save = async (req, res, next) => {
  try {
    await userSchema.validate(req.body);
    const { nome, email, senha } = req.body;

    const user = await knex("usuarios").where({ email }).first();

    if (user) {
      return res
        .status(400)
        .json({ message: "The provided email is already in use" });
    }

    const cryptoPassword = await bcrypt.hash(senha, 10);

    const registeredUser = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: cryptoPassword,
      })
      .returning(["id", "nome", "email"]);

    return res.status(201).json(registeredUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const detail = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const update = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    const id = req.user.id;

    try {
      await userSchema.validate({ nome, email, senha });

      const userWithSameEmail = await knex("usuarios")
        .where({ email })
        .whereNot({ id })
        .first();

      if (userWithSameEmail) {
        return res.status(400).json({
          message: "The email provided already belongs to another user.",
        });
      }

      const newHash = await bcrypt.hash(senha, 10);

      const updatedUser = await knex("usuarios")
        .update({
          nome,
          email,
          senha: newHash,
        })
        .where({ id })
        .returning(["id", "nome", "email"]);

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  save,
  detail,
  update,
};
