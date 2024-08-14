const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: false },
    email_verified: { type: Boolean, default: false },
    family_name: { type: String },
    given_name: { type: String, required: true },
    locale: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    sub: { type: String },
    phone: { type: String, default: "12345678" },
    identification: {
      verify: { type: Boolean, default: false },
      type: { type: String, default: "DNI" },
      number: { type: Number, default: 12345678 },
    },
    address: {
      verify: { type: Boolean, default: false },
      country: { type: String, default: "Argentina" },
      state: { type: String, default: "Misiones" },
      city: { type: String, default: "Obera" },
      street_name: { type: String, default: "Almte. Brown" },
      street_number: { type: Number, default: 123 },
      codigo_postal: { type: String, default: "3364" },
    },
    isSuscribed: { type: Boolean, default: false },
    suscribedLevel: { type: Number, default: 0 },
    hasDiscount: { type: Boolean, default: false },
    oberCoins: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    purchases: {
      products: [
        {
          products: { type: Schema.Types.ObjectId, ref: "products" },
          quantity: { type: Number },
        },
      ],
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "favorite" }],
    cart: [{ type: Schema.Types.ObjectId, ref: "cart" }],
    terms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Índices
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 });
userSchema.index({ isAdmin: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
