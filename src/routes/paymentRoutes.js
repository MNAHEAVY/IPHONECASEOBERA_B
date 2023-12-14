const { Router } = require("express");
const { createPreference } = require("../controllers/MercadoPago/MercadoPago");
const { paymentSucceded } = require("../controllers/MercadoPago/MercadoPago");

const router = Router();

router.post("/create_preference", createPreference);
router.post("/payment_success", paymentSucceded);

module.exports = router;
