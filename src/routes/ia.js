const { Router } = require("express");
const { chatWithAI } = require("../controllers/ia/ia");

const router = Router();

router.post("/chat", chatWithAI);

module.exports = router;
