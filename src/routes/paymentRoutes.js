const { Router } = require("express");
const { createPreference } = require("../controllers/MercadoPago/MercadoPago");
const { paymentSucceded } = require("../controllers/MercadoPago/MercadoPago");
const { suscriptorSucceded } = require("../controllers/users/suscription");

const router = Router();

router.post("/create_preference", createPreference);
router.post("/payment_success", paymentSucceded);
router.post("/suscription", suscriptorSucceded);

module.exports = router;
