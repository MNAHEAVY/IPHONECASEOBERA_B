const { Router } = require("express");
const getValues = require("../controllers/values/getValues");
const editValues = require("../controllers/values/editValues");
const router = Router();

router.get("/values", getValues);
router.put("/values/:id", editValues);

module.exports = router;
