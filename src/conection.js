require("dotenv").config();
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.HOST_CONEXAO,
    port: process.env.PORT_CONEXAO,
    user: process.env.USER_CONEXAO,
    password: process.env.PASSWORD_CONEXAO,
    database: process.env.DATABASE_CONEXAO,
  },
});

module.exports = knex;
