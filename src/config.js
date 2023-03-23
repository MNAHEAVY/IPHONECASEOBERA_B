const { config } = require("dotenv");
config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://DavidHartel:IPHONECASEOBERA@cluster0.ri8pwk1.mongodb.net/products?retryWrites=true&w=majority";

module.exports = {
  PORT,
  MONGODB_URI,
};
