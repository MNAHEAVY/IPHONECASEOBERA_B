const Products = require("../../models/products");

const updateProduct = async (req, res) => {
  const { id } = req.params;
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
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
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
