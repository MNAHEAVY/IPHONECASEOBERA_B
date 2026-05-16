const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const valuesSchema = new mongoose.Schema({
  dolar: { type: Number },
  margen: { type: Number },
  flete: { type: Number },
  profit: { type: Number },
  obercoins: { type: Number },
  costosDeEnvio: { type: Array },
  costosGeneralIphone: { type: Number },
  profitIphone: { type: Object },
  comision: { type: Number },
  iva: { type: Number },
  mp: { type: Number },
  rentas: { type: Number },
});

const Values = mongoose.model("values", valuesSchema);

module.exports = Values;
