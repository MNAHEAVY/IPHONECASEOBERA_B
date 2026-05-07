const OpenAI = require("openai");
const Products = require("../../models/products");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const userMsg = req.body.message;
    const history = req.body.history || [];

    if (!userMsg) {
      return res.status(400).json({
        error: "Mensaje vacío",
      });
    }

    // =========================================
    // TRAER PRODUCTOS DESDE MONGO

    // =========================================

    const productsList = await Products.find();

    const productText = productsList
      .map(
        (p) =>
          `• ${p.nombre} — $${p.precioBase} — Stock: ${p.stockGeneral} — Categoría: ${p.categoria}
 — Subcategoría: ${p.subcategoria}`,
      )
      .join("\n");
    // =========================================
    // MENSAJES OPENAI
    // =========================================

    const conversationMessages = [
      {
        role: "system",
        content:
          `Sos un asistente experto en productos Apple y en el catálogo de la empresa.
Respondés en español, de forma clara, breve y con un tono cordial y vendedor.

Cuando respondas:
- Explicá los beneficios de los productos, no solo las especificaciones.
- Si existe un producto del catálogo relacionado con la consulta, sugerilo.
- Cerrá con una invitación suave a continuar (ej: “¿Querés que te recomiende una opción?”).

Podés responder consultas generales sobre productos Apple (modelos, diferencias, compatibilidad).
Para precios, stock y disponibilidad, usás exclusivamente la información del catálogo.

Si te preguntan algo que no sea sobre Apple o productos, indicás que solo atendés consultas de Apple.
No inventes información.
Siempre que sea posible, cerrá la respuesta con una pregunta corta orientada a la compra.

`.trim(),
      },

      {
        role: "system",
        content: `CATÁLOGO DISPONIBLE:\n\n${productText}`,
      },

      // =========================================
      // HISTORIAL CONVERSACIÓN
      // =========================================

      ...history.slice(-8).map((msg) => ({
        role: msg.role === "bot" ? "assistant" : msg.role,

        content: msg.content || msg.text,
      })),

      // =========================================
      // MENSAJE ACTUAL
      // =========================================

      {
        role: "user",
        content: userMsg,
      },
    ];

    // =========================================
    // OPENAI
    // =========================================

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: conversationMessages,
    });

    // =========================================
    // RESPONSE
    // =========================================

    res.json({
      reply: aiResponse.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};
