const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    attributes: {
      color: {
        type: String,
        default: "",
      },
      model: {
        type: String,
        default: "",
      },
      storage: {
        type: String,
        default: "",
      },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
