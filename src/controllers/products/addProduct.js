const Products = require("../../models/products");

const createProduct = async (req, res) => {
  const {
    linea,
    categorias,
    nombre,
    color,
    precio,
    imagen,
    modelo,
    stock,
    pickColor,
    descripcion,
    almacenamiento,
    estado,
    disponible,
  } = req.body;

  try {
    const newProduct = new Products({
      linea,
      categorias,
      nombre,
      color,
      precio,
      imagen,
      modelo,
      stock,
      pickColor,
      descripcion,
      almacenamiento,
      estado,
      disponible,
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createProduct;
