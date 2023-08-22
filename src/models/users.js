const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  email_verified: { type: Boolean, required: true },
  family_name: { type: String, required: false },
  given_name: { type: String, required: true },
  locale: { type: String, required: false },
  name: { type: String, required: false },
  nickname: { type: String, required: false },
  picture: { type: String, required: false },
  sub: { type: String, required: false },

  address: {
    pais: { type: String, required: false, default: "Argentina" },
    provincia: { type: String, required: false, default: "Misiones" },
    ciudad: { type: String, required: false, default: "Obera" },
    direccion: { type: String, required: false, default: "Almte. Brown 00" },
    codigo_postal: { type: String, required: false, default: "3364" },
  },
  isSuscribed: { type: Boolean, default: false },
  hasDiscount: { type: Boolean, default: false },
  oberCoins: { type: Number, default: 0 },
  payment: {
    cardType: { type: String, required: false, default: "Visa" },
    cardName: { type: String, required: false, default: "Jhon Smith" },
    cardNumber: {
      type: String,
      required: false,
      default: "xxxx-xxxx-xxxx-1234",
    },
    expDate: { type: String, required: false, default: "04/2026" },
    CVV: { type: String, required: false, default: "099" },
  },
  isAdmin: { type: Boolean, required: false, default: false },
  isBanned: { type: Boolean, required: false, default: false },
  purchase_order: {
    products: [
      {
        products: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
      },
    ],

    buyHistory: { type: [Schema.Types.ObjectId], ref: "transaction" },
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: "favorite" }],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "cart",
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
