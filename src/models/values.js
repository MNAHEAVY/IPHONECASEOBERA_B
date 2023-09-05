const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const valuesSchema = new mongoose.Schema({
  dolarBlue: { type: Number, required: true, default: 750 },
  dolarOficial: { type: Number, required: true, default: 750 },
  packaginPremium: { type: Number, required: true, default: 750 },
  packagingSimple: { type: Number, required: true, default: 750 },
  costoGeneral: { type: Number, required: true, default: 750 },
  flete: { type: Number, required: true, default: 750 },
  profit: { type: Number, required: true, default: 750 },
  obercoins: { type: Number, required: true, default: 750 },
  costosDeEnvio: { type: Object },
});

const Values = mongoose.model("values", valuesSchema);

module.exports = Values;
