const mongoose = require("mongoose");
require("dotenv").config();

const Products = require("./src/models/products"); // nuevo schema

mongoose.connect(
  "mongodb+srv://DavidHartel:IPHONECASEOBERA@cluster0.ri8pwk1.mongodb.net/products?retryWrites=true&w=majority",
);
/* =========================
UTILS
========================= */

function slugify(text) {
  return (
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "") || "producto"
  );
}

function clean(text) {
  return text?.trim() || "";
}

/* =========================
DETECTAR MODELO IPHONE
========================= */

function detectIphoneModel(name) {
  const models = [
    "15 pro max",
    "15 pro",
    "15 plus",
    "15",
    "14 pro max",
    "14 pro",
    "14 plus",
    "14",
    "13 pro max",
    "13 pro",
    "13",
    "12 pro max",
    "12 pro",
    "12",
    "11",
  ];

  name = name.toLowerCase();

  for (const model of models) {
    if (name.includes(model)) {
      return model.toUpperCase();
    }
  }

  return null;
}

/* =========================
SKU GENERATOR
========================= */

function generateSKU(name, color, storage) {
  let base = "PRD";

  if (name.toLowerCase().includes("iphone")) base = "IP";
  if (name.toLowerCase().includes("case")) base = "CASE";
  if (name.toLowerCase().includes("airpods")) base = "AIR";

  const colorCode = color?.substring(0, 3).toUpperCase() || "STD";

  const storageCode = storage?.replace("GB", "")?.replace("TB", "T") || "";

  return `${base}-${colorCode}-${storageCode}`;
}

/* =========================
CATEGORY MAP
========================= */

function mapCategory(name) {
  name = name.toLowerCase();

  if (name.includes("iphone")) return "iphone";
  if (name.includes("ipad")) return "ipad";
  if (name.includes("mac")) return "mac";
  if (name.includes("watch")) return "watch";
  if (name.includes("airpods")) return "airpods";
  if (name.includes("accessorios")) return "accessorios";
  if (name.includes("otros")) return "otros";

  return "accessorios";
}

/* =========================
MIGRATION
========================= */

async function migrate() {
  const products = await Products.find({}).lean();

  console.log("Productos:", products.length);

  for (const old of products) {
    const name = clean(old.nombre) || "Producto sin nombre";
    const variants = [];
    const colors = old.color || [];
    const storages = old.almacenamiento || [];
    const models = old.modelo || [];

    /* =========================
       VARIANTES COLOR + STORAGE + MODELO
    ========================= */

    if (colors.length && storages.length && models.length) {
      for (const model of models) {
        for (const color of colors) {
          for (const storage of storages) {
            variants.push({
              sku: generateSKU(name, color.nombre, storage.capacidad),

              price: storage?.precio || old.precioBase || 0,

              stock: storage.stockStorage || color.stockColor || old.stockGeneral || 0,

              attributes: {
                model: model.nombre || model,
                color: color.nombre,
                storage: storage.capacidad,
              },

              images: [color.imageColor].filter(Boolean),

              available: true,
            });
          }
        }
      }
    } else if (colors.length && storages.length) {
      /* =========================
       COLOR + STORAGE
    ========================= */
      for (const color of colors) {
        for (const storage of storages) {
          variants.push({
            sku: generateSKU(name, color.nombre, storage.capacidad),

            price: storage?.precio || old.precioBase || 0,

            stock: storage.stockStorage || color.stockColor || old.stockGeneral || 0,

            attributes: {
              color: color.nombre,
              storage: storage.capacidad,
            },

            images: [color.imageColor].filter(Boolean),

            available: true,
          });
        }
      }
    } else if (colors.length) {
      /* =========================
       SOLO COLOR
    ========================= */
      for (const color of colors) {
        variants.push({
          sku: generateSKU(name, color.nombre),

          price: old.precioBase || 0,

          stock: color.stockColor || old.stockGeneral || 0,

          attributes: {
            color: color.nombre,
          },

          images: [color.imageColor].filter(Boolean),

          available: true,
        });
      }
    } else if (storages.length) {
      /* =========================
       SOLO STORAGE
    ========================= */
      for (const storage of storages) {
        variants.push({
          sku: generateSKU(name, null, storage.capacidad),

          price: storage?.precio || old.precioBase || 0,

          stock: storage.stockStorage || old.stockGeneral || 0,

          attributes: {
            storage: storage.capacidad,
          },

          images: old.imagenGeneral || [],

          available: true,
        });
      }
    } else {
      /* =========================
       SIN VARIANTES
    ========================= */
      variants.push({
        sku: generateSKU(name),

        price: old.precioBase || 0,

        stock: old.stockGeneral || 0,

        attributes: {},

        images: old.imagenGeneral || [],

        available: true,
      });
    }

    /* =========================
       ELIMINAR VARIANTES VACÍAS
    ========================= */

    const cleanVariants = variants.filter(
      (v) => v.price !== undefined && v.stock !== undefined,
    );

    /* =========================
    STOCK TOTAL
    ========================= */

    const totalStock = cleanVariants.reduce((a, v) => a + v.stock, 0);

    /* =========================
    CATEGORY
    ========================= */

    const category = mapCategory(name);

    /* =========================
    COMPATIBILITY
    ========================= */

    const model = detectIphoneModel(name);

    const compatibleWith = model ? [`iPhone ${model}`] : [];
    /* =========================
    UPDATE DOC
    ========================= */
    const updatedProduct = {
      name: name,

      slug: slugify(name),

      brand: clean(old.marca) || "Apple",

      category: category,

      subCategory: clean(old.subCategoria)?.toLowerCase() || "cases",

      description: clean(old.descripcion),

      images: old.imagenGeneral || [],

      variants: cleanVariants,

      totalStock: totalStock,

      available: totalStock > 0,

      compatibleWith: compatibleWith,

      seo: {
        title: name,
        description: old.descripcion?.slice(0, 150) || "",
      },
    };

    /* =========================
       ACTUALIZAR DOCUMENTO
    ========================= */

    await Products.updateOne({ _id: old._id }, { $set: updatedProduct });

    console.log("Migrado:", name);
  }

  console.log("Migración completa");

  mongoose.disconnect();
}

migrate();
