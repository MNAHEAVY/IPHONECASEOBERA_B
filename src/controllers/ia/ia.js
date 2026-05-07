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

    const productsList = await Products.find()
      .select("nombre precioBase stockGeneral categoria subcategoria")
      .limit(250);

    // =========================================
    // FORMATEAR CATÁLOGO
    // =========================================

    const productText = productsList
      .map(
        (p) =>
          `• ${p.nombre}
Precio: $${p.precioBase}
Stock: ${p.stockGeneral}
Categoría: ${p.categoria}
Subcategoría: ${p.subcategoria}`,
      )
      .join("\n\n");

    // =========================================
    // MENSAJES OPENAI
    // =========================================

    const conversationMessages = [
      {
        role: "system",
        content: `
Sos el asistente oficial de una tienda especializada en productos Apple.

Tu trabajo es responder utilizando EXCLUSIVAMENTE la información del catálogo enviado.

Reglas IMPORTANTES:
- Nunca inventes productos.
- Nunca inventes precios.
- Nunca inventes stock.
- Si un producto aparece en el catálogo, asumí que está disponible.
- Si un producto NO aparece en catálogo, decí claramente que no lo encontraste en la tienda.
- Priorizá SIEMPRE los productos del catálogo.
- Respondé en español.
- Respondé breve, claro y con tono vendedor.
- Explicá beneficios de los productos.
- Si preguntan por accesorios o fundas, sugerí productos relacionados del catálogo.
- Terminá la respuesta con una pregunta corta orientada a la compra.
- Nunca respondas como soporte oficial Apple.
- Nunca recomiendes consultar Apple oficial.
- Nunca digas que no tenés acceso al stock.

IMPORTANTE:
El catálogo enviado ES el stock real de la tienda.
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
