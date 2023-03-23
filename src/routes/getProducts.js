const { Router } = require("express");
const getProducts = require("../controllers/products/getProducts");
const getProduct = require("../controllers/products/getOneP");
const editProduct = require("../controllers/products/editProduct");
const addProduct = require("../controllers/products/addProduct");
const deleteProduct = require("../controllers/products/deleteProduct");
const router = Router();

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.put("/product/:id", editProduct);
router.post("/products", addProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
