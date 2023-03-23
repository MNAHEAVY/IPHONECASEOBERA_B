const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const valuesSchema = new mongoose.Schema({
  dolarBlue: { type: Number, required: true },
  dolarOficial: { type: Number, required: true },
  packaginPremium: { type: Number, required: true },
  packagingSimple: { type: Number, required: true },
  costoGeneral: { type: Number, required: true },
  flete: { type: Number, required: true },
  profit: { type: Number, required: true },
});

const Values = mongoose.model("values", valuesSchema);

module.exports = Values;
