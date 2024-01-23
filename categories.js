const knex = require("../conection");

const categoriesController = async (req, res, next) => {
  try {
    let allCategories = await knex("categorias");
    return res.json(allCategories);
  } catch (error) {
    res.status(500).json({ mensagem: "Internal Server Error" });
  }
};

module.exports = categoriesController;
