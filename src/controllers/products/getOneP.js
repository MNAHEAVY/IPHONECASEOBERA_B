const Products = require("../../models/products");

//Get one by id

const getProduct = async (req, res) => {
  try {
    const one = await Products.findOne({ _id: req.params.id });
    if (!one) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(one);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = getProduct;
