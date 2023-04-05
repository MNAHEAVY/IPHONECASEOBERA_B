const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const getRoutes = require("./routes/getProducts");
const addUsers = require("./routes/addUsers");
const getValues = require("./routes/getValues");
const payment = require("./routes/paymentRoutes");
//MIDDLEWARES
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());

//Rutas

//productos

app.use("/", getRoutes);
app.use("/", addUsers);
app.use("/", getValues);
app.use("/", payment);

//users

module.exports = app;
