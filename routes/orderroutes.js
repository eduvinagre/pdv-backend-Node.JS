const express = require("express");
const router = express.Router();
const tokenValidator = require("../middlewares/tokenvalidation");
const orderController = require("../controllers/order");

router.use(tokenValidator);

router.post("/pedido", orderController.create);
router.get("/pedido", orderController.list);

module.exports = router;