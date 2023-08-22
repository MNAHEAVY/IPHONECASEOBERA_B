const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product", // Nombre de la colección de productos
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user", // Nombre de la colección de usuarios
  },
});

const Favorite = mongoose.model("favorite", favoriteSchema);

module.exports = Favorite;
