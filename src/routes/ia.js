const express = require("express");
const { Router } = require("express");
const OpenAI = require("openai");
require("dotenv").config();
const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta para manejar las solicitudes desde el frontend
router.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating completion" });
  }
});
module.exports = router;
