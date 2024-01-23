const yup = require("yup");

const userSchema = yup.object({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required(),
});

const authenticationSchema = yup.object({
  email: yup.string().email().required(),
  senha: yup.string().required(),
});

module.exports = {
  userSchema,
  authenticationSchema,
};
