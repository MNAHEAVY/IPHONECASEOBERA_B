const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const colorSchema = new Schema({
  nombre: String,
  imageColor: String,
  stockColor: Number,
  estado: String,
});

const almacenamientoSchema = new Schema({
  capacidad: String,
  precio: Number,
  stockStorage: Number,
  disponible: Boolean,
  estado: String,
});
const modeloSchema = new Schema({
  nombre: String,
  precio: Number,
  stockModel: Number,
  disponible: Boolean,
  imageModel: String,
});

const productsSchema = new mongoose.Schema({
  categorias: { type: String, required: true },
  subCategoria: { type: String, required: true },
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenGeneral: { type: [String], required: true },
  stockGeneral: {
    type: Number,
    validate: {
      validator: function (el) {
        return el >= 0;
      },
      message: "Stock can not be a negative value",
    },
  },
  estado: { type: String, required: true },
  precioBase: { type: Number, required: true },
  disponible: { type: Boolean, required: true },
  tipo: { type: String, required: true },
  color: [colorSchema],
  almacenamiento: [almacenamientoSchema],
  modelo: [modeloSchema],
});

productsSchema.pre("save", function (next) {
  if (this.stockGeneral <= 0) {
    this.disponible = false;
  } else {
    this.disponible = true;
  }
  next();
});

const Products = mongoose.model("products", productsSchema);

module.exports = Products;
