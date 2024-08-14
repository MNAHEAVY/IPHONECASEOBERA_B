const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const passport = require("./passport");
const getRoutes = require("./routes/getProducts");
const addUsers = require("./routes/addUsers");
const getValues = require("./routes/getValues");
const payment = require("./routes/paymentRoutes");
const banners = require("./routes/banners");
const auth = require("./routes/auth");
const ia = require("./routes/ia");
//MIDDLEWARES
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());
//Rutas

//productos

app.use("/", getRoutes);
app.use("/", addUsers);
app.use("/", getValues);
app.use("/", payment);
app.use("/", banners);
app.use("/", ia);

//users
app.use("/auth", auth);

// Rutas protegidas con JWT
app.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "You have accessed a protected route!" });
});

module.exports = app;
