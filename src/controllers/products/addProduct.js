const Products = require("../../models/products");

const createProduct = async (req, res) => {
  const {
    categorias,
    subCategoria,
    nombre,
    marca,
    descripcion,
    imagenGeneral,
    stockGeneral,
    estado,
    precioBase,
    disponible,
    tipo,
    color,
    almacenamiento,
    modelo,
  } = req.body;

  try {
    const newProduct = new Products({
      categorias,
      subCategoria,
      nombre,
      marca,
      descripcion,
      imagenGeneral,
      stockGeneral,
      estado,
      precioBase,
      disponible,
      tipo,
      color,
      almacenamiento,
      modelo,
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error); // Imprime el error para ayudar a diagnosticar el problema.
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createProduct;
