const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const knex = require("../conection");
const { authenticationSchema } = require("../validations/userSchema");

const login = async (req, res, next) => {
  try {
    await authenticationSchema.validate(req.body);
    const { email, senha } = req.body;

    const userFound = await knex("usuarios").where({ email }).first();

    if (!userFound) {
      return res.status(400).json({ message: "User / password is incorrect!" });
    }

    const validPassword = await bcrypt.compare(senha, userFound.senha);

    if (!validPassword) {
      return res.status(400).json({ message: "User / password is incorrect!" });
    }

    const token = jwt.sign(
      {
        id: userFound.id,
        nome: userFound.nome,
        email: userFound.email,
      },
      process.env.SENHA_JWT,
      { expiresIn: "2h" }
    );

    const { senha: newPassword, ...user } = userFound;

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
