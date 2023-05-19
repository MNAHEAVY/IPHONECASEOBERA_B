const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const bannersSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  enlace: { type: String, required: true },
  orden: { type: Number, required: true },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
});

const Banners = mongoose.model("banners", bannersSchema);

module.exports = Banners;
