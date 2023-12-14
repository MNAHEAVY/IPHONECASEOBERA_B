const { Router } = require("express");
const { createPreference } = require("../controllers/MercadoPago/MercadoPago");

const router = Router();

router.post("/create_preference", createPreference);

module.exports = router;
