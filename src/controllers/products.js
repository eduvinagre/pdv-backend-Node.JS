const knex = require("../conection");
const { uploadImage, deleteFile } = require("../services/files");
const productsSchema = require("../validations/productsSchema");

const create = async (req, res) => {
  try {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    let image = {};

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;
      image = await uploadImage(originalname, buffer, mimetype);
    }

    const { error } = productsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!valor) {
      return res.status(400).json({ message: "price not specified." });
    }

    const categoryExists = await knex("categorias")
      .where({ id: categoria_id })
      .first();
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found." });
    }

    const insertedProduct = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: image.url,
      })
      .returning("*");

    return res.status(201).json({ id: insertedProduct[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    let image = {};

    const { error } = productsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const categoryExists = await knex("categorias")
      .where({ id: categoria_id })
      .first();
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found." });
    }
    const productExists = await knex("produtos").where({ id }).first();
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;
      image = await uploadImage(originalname, buffer, mimetype);
    }

    const updatedProductFields = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    if (req.file) {
      updatedProductFields.produto_imagem = image.url;
    }

    const updatedProduct = await knex("produtos")
      .where({ id })
      .update(updatedProductFields)
      .returning("*");

    return res.status(200).json({ id: updatedProduct[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { categoria_id } = req.query;

    let query = knex("produtos");
    if (categoria_id) {
      const categoryExists = await knex("categorias")
        .where({ id: categoria_id })
        .first();
      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found." });
      }

      query = query.where({ categoria_id });
    }

    const products = await query;

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await knex("produtos").where("id", id);

    if (product < 1) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const productExists = await knex("produtos").where({ id }).first();
    if (!productExists) {
      console.log(error.message);
      return res.status(404).json({ message: "Product not found." });
    }

    const productInOrder = await knex("pedido_produtos")
      .where({ produto_id: id })
      .first();

    if (productInOrder) {
      return res.status(400).json({
        message:
          "Product cannot be deleted because it is associated with an order.",
      });
    }

    const deletedProduct = await knex("produtos")
      .where({ id })
      .del()
      .returning("*");

    const productImage = deletedProduct[0].produto_imagem;

    if (productImage) {
      await deleteFile(productImage);
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  edit,
  list,
  detail,
  remove,
};
