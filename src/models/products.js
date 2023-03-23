const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const productsSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  linea: { type: String, required: true },
  categorias: { type: String, required: true },
  nombre: { type: String, required: true },
  color: { type: Array, required: true },
  precio: { type: Array, required: true },
  imagen: { type: Array, required: true },
  modelo: { type: Array, required: true },
  stock: {
    type: Number,
    validate: {
      validator: function (el) {
        return el >= 0;
      },
      message: "Stock can not be a negative value",
    },
  },
  pickColor: { type: Array, required: true },
  descripcion: { type: String, required: true },
  almacenamiento: { type: Array, required: true, default: true },
  estado: { type: String, required: true, default: false },
  disponible: { type: Boolean, required: true },
  transactions: {
    type: [Schema.Types.ObjectId],
    ref: "transaction",
  },
  date: { type: Date, default: Date.now() },
});

productsSchema.pre("save", function (next) {
  if (this.stock <= 0) {
    this.status = false;
  } else {
    this.status = true;
  }
  next();
});

const Products = mongoose.model("products", productsSchema);

module.exports = Products;
