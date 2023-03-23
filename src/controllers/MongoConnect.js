const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(console.log("connected to database"))
  .catch((err) => console.log(err));
