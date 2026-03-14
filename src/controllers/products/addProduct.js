const Products = require("../../models/products");

const createProduct = async (req, res) => {
  try {
    let {
      name,
      slug,
      brand,
      category,
      subCategory,
      description,
      images = [],
      variants = [],
      totalStock,
      available,
      compatibleWith = [],
      seo = {},
    } = req.body;

    console.log("BODY:", req.body);
    console.log("compatibleWith:", compatibleWith);
    console.log("typeof compatibleWith:", typeof compatibleWith);
    console.log("isArray compatibleWith:", Array.isArray(compatibleWith));

    if (typeof compatibleWith === "string") {
      try {
        compatibleWith = JSON.parse(compatibleWith);
      } catch (e) {
        console.error("Error parseando compatibleWith:", e);
        compatibleWith = [];
      }
    }

    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        console.error("Error parseando variants:", e);
        variants = [];
      }
    }

    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        console.error("Error parseando images:", e);
        images = [];
      }
    }

    if (!name) {
      return res.status(400).json({ message: "El campo name es obligatorio." });
    }

    if (!category) {
      return res.status(400).json({ message: "El campo category es obligatorio." });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        message: "El producto debe tener al menos una variante.",
      });
    }

    const newProduct = new Products({
      name,
      slug,
      brand,
      category,
      subCategory,
      description,
      images,
      variants,
      totalStock:
        totalStock ??
        variants.reduce((acc, variant) => acc + (Number(variant.stock) || 0), 0),
      available:
        available ?? variants.some((variant) => (Number(variant.stock) || 0) > 0),
      compatibleWith,
      seo,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = createProduct;