require("dotenv").config();

const mongoose = require("mongoose");
const Values = require("./src/models/values");

async function migrate() {
  try {
    mongoose.connect(
      "mongodb+srv://DavidHartel:IPHONECASEOBERA@cluster0.ri8pwk1.mongodb.net/products?retryWrites=true&w=majority",
    );

    const docs = await Values.find();

    for (let doc of docs) {
      doc.dolar = doc.dolarBlue;
      doc.margen = doc.costoGeneral;
      doc.iva = doc.tasa;

      // eliminar viejos
      doc.dolarBlue = undefined;
      doc.costoGeneral = undefined;
      doc.tasa = undefined;

      await doc.save();
    }
    console.log("Migration completed");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

migrate();
