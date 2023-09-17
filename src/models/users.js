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
  phone: { type: Number, default: 12345678 },
  identification: {
    verify: { type: Boolean, required: false, default: false },
    type: { type: String, required: false, default: "DNI" },
    number: { type: Number, default: 12345678 },
  },
  address: {
    verify: { type: Boolean, required: false, default: false },
    country: { type: String, required: false, default: "Argentina" },
    state: { type: String, required: false, default: "Misiones" },
    city: { type: String, required: false, default: "Obera" },
    street_name: { type: String, required: false, default: "Almte. Brown" },
    street_number: { type: Number, required: false, default: 123 },
    codigo_postal: { type: String, required: false, default: "3364" },
  },
  isSuscribed: { type: Boolean, default: false },
  hasDiscount: { type: Boolean, default: false },
  oberCoins: { type: Number, default: 0 },
  isAdmin: { type: Boolean, required: false, default: false },
  isBanned: { type: Boolean, required: false, default: false },
  purchases: {
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
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: "favorite" }],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "cart",
    },
  ],
  terms: { type: Boolean, required: false, default: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
