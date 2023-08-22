const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  name: { type: String },
  image: { type: String },
  stock: { type: Number },
  color: { type: String },
  model: { type: String },
  capacidad: { type: String },
  price: { type: Number },
  quantity: {
    type: Number,
    default: 1,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
