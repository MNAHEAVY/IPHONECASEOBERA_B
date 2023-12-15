const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const bannerSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  enlace: { type: String, required: true },
  orden: { type: Number, required: true },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
});

const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;
