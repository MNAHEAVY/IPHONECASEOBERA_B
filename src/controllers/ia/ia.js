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
    // NORMALIZAR MENSAJE
    // =========================================

    const normalizedMsg = userMsg.toLowerCase();

    // =========================================
    // DETECTAR CATEGORÍA
    // =========================================

    let categoria = null;

    if (normalizedMsg.includes("funda") || normalizedMsg.includes("case")) {
      categoria = "fundas";
    }

    if (normalizedMsg.includes("cargador") || normalizedMsg.includes("charger")) {
      categoria = "cargadores";
    }

    if (normalizedMsg.includes("templado") || normalizedMsg.includes("vidrio")) {
      categoria = "vidrios";
    }

    if (normalizedMsg.includes("airpods") || normalizedMsg.includes("auriculares")) {
      categoria = "auriculares";
    }

    // =========================================
    // DETECTAR MODELO
    // =========================================

    const modelMatch = normalizedMsg.match(/(iphone\s?\d+\s?(pro|max|plus)?)/i);

    // =========================================
    // QUERY DINÁMICA
    // =========================================

    const query = {};

    if (categoria) {
      query.categoria = {
        $regex: categoria,
        $options: "i",
      };
    }

    if (modelMatch) {
      query.nombre = {
        $regex: modelMatch[0],
        $options: "i",
      };
    }

    // =========================================
    // CONSULTA DB
    // =========================================

    let productsList = await Products.find(query)
      .select("nombre precioBase stockGeneral categoria subcategoria")
      .limit(10);

    // =========================================
    // FALLBACK
    // =========================================

    if (productsList.length === 0) {
      productsList = await Products.find()
        .select("nombre precioBase stockGeneral categoria subcategoria")
        .limit(5);
    }

    // =========================================
    // FORMATEAR CATÁLOGO
    // =========================================

    const productText = productsList
      .map(
        (p) =>
          `• ${p.nombre} — $${p.precioBase} — Stock: ${p.stockGeneral} — Categoría: ${p.categoria}`,
      )
      .join("\n");

    // =========================================
    // HISTORIAL
    // =========================================

    const conversationMessages = [
      {
        role: "system",
        content: `
Sos un asistente experto en productos Apple y en el catálogo de la empresa.

Respondés:
- En español
- De forma clara
- Breve
- Con tono cordial y vendedor

Reglas:
- Explicá beneficios, no solo especificaciones.
- Si existe un producto relacionado en catálogo, sugerilo.
- Cerrá con una pregunta corta orientada a la compra.
- Podés responder consultas generales sobre Apple.
- Para precios y stock usás SOLO la información del catálogo.
- Si preguntan algo fuera de Apple o tecnología, indicás que solo atendés consultas Apple.
- No inventes productos, precios ni stock.
`.trim(),
      },

      {
        role: "system",
        content: `Catálogo disponible:\n${productText}`,
      },

      // SOLO ÚLTIMOS MENSAJES
      ...history.slice(-6).map((msg) => ({
        role: msg.role === "bot" ? "assistant" : msg.role,

        content: msg.content || msg.text,
      })),

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
