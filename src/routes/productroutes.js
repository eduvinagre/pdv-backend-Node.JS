const express = require("express");
const router = express.Router();
const tokenValidator = require("../middlewares/tokenvalidation");
const productControllers = require("../controllers/products");
const multer = require("../middlewares/multer");

router.use(tokenValidator);

router.post(
  "/produto",
  multer.single("produto_imagem"),
  productControllers.create
);
router.get("/produto", productControllers.list);
router.get("/produto/:id", productControllers.detail);
router.put(
  "/produto/:id",
  multer.single("produto_imagem"),
  productControllers.edit
);
router.delete(
  "/produto/:id",
  multer.single("produto_imagem"),
  productControllers.remove
);

module.exports = router;
