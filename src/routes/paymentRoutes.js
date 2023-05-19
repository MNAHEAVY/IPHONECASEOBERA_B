const { Router } = require("express");
const {
  createPreference,
  createFeedback,
} = require("../controllers/MercadoPago/MercadoPago");

const router = Router();

router.post("/create_preference", createPreference);

router.get("/feedback?", createFeedback);

module.exports = router;
