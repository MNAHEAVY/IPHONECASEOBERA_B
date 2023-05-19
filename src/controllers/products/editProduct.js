const Products = require("../../models/products");

const updateProduct = async (req, res) => {
  const { id } = req.params;
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
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateProduct;
