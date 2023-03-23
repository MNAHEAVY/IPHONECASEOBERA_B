const { Router } = require("express");
const getValues = require("../controllers/values/getValues");
const router = Router();

router.get("/values", getValues);

module.exports = router;
