const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const categoriesController = require("../controllers/categories");
const userAuthentication = require("../controllers/authentication");
const tokenValidator = require("../middlewares/tokenvalidation");

router.get("/categoria", categoriesController);
router.post("/usuario", userController.save);
router.post("/login", userAuthentication.login);

router.use(tokenValidator);

router.get("/usuario", userController.detail);
router.put("/usuario", userController.update);

module.exports = router;
