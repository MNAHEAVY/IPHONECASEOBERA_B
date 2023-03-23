const Products = require("../../models/products");

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Products.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteProduct;
