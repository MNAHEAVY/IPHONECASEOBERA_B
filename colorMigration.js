require("dotenv").config();

const mongoose = require("mongoose");
const Products = require("./src/models/products");

const { resolveColorKey } = require("./src/utils/colors");

async function migrate() {
  try {
    mongoose.connect(
      "mongodb+srv://DavidHartel:IPHONECASEOBERA@cluster0.ri8pwk1.mongodb.net/products?retryWrites=true&w=majority",
    );

    const products = await Products.find();

    for (const product of products) {
      let changed = false;

      product.variants = product.variants.map((variant) => {
        if (!variant.attributes) {
          variant.attributes = {};
        }

        if (variant.attributes.colorKey && variant.attributes.colorLabel) {
          return variant;
        }

        const legacyColor = variant.attributes.color || "";

        variant.attributes.colorKey = resolveColorKey(legacyColor);

        variant.attributes.colorLabel = legacyColor || variant.attributes.colorKey;

        changed = true;

        return variant;
      });

      if (changed) {
        await product.save();

        console.log(`Migrated: ${product.name}`);
      }
    }

    console.log("Migration completed");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

migrate();
