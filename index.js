const express = require("express");
require("dotenv").config();

const userRoutes = require("./routes/userroutes");
const productRoutes = require("./routes/productroutes");
const customerRoutes = require("./routes/customerroutes");
const orderRoutes = require("./routes/orderroutes")
const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(customerRoutes);
app.use(orderRoutes)

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor rodando na porta: http://localhost:${process.env.PORT}`
  );
});
