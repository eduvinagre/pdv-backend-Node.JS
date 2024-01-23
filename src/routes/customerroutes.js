const express = require("express");
const router = express.Router();
const tokenValidator = require("../middlewares/tokenvalidation");
const customersControllers = require("../controllers/customers");

router.use(tokenValidator);

router.post("/cliente", customersControllers.save);
router.put("/cliente/:id", customersControllers.update);
router.get("/cliente", customersControllers.list);
router.get("/cliente/:id", customersControllers.detail);

module.exports = router;
