const jwt = require("jsonwebtoken");

const tokenValidator = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SENHA_JWT);
    
    req.user = {
      id: decodedToken.id,
      nome: decodedToken.nome,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = tokenValidator;
