const mongoose = require("mongoose");
const MONGUS_URI =
  "mongodb+srv://DavidHartel:IPHONECASEOBERA@cluster0.ri8pwk1.mongodb.net/products?retryWrites=true&w=majority";

mongoose
  .connect(MONGUS_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(console.log("connected to database"))
  .catch((err) => console.log(err));
