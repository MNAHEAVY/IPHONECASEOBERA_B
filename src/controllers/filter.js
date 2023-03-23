const Products = require("../models/products");

async function filterProducts(req, res) {
  let condition = {};
  try {
    for (const prop in req.query) {
      if (prop === "precio") {
        let [min, max] = req.query[prop].split("/");
        condition[prop] = {
          $lte: parseInt(max),
          $gte: parseInt(min),
        };
      } else {
        condition[prop] = new RegExp(req.query[prop], "i");
      }
    }
    const foundProducts = await Products.find(condition);
    res.send(foundProducts);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = { filterProducts };
