const Products = require("../../models/products");

//Get all products

const getProducts = async (req, res) => {
  const prodcts = await Products.find({});
  try {
    return res.status(200).json(prodcts);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = getProducts;
