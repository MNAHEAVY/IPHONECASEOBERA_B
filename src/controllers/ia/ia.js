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
    // EXTRAER PALABRAS CLAVE
    // =========================================

    const keywords = [];

    // MODELOS
    const modelMatch = normalizedMsg.match(
      /(iphone\s?\d+\s?(pro|max|plus)?|\d+\s?(pro|max|plus)?)/gi,
    );

    if (modelMatch) {
      keywords.push(...modelMatch);
    }

    // ACCESORIOS
    const accessoryWords = [
      "funda",
      "fundas",
      "case",
      "cargador",
      "templado",
      "vidrio",
      "airpods",
      "auriculares",
    ];

    accessoryWords.forEach((word) => {
      if (normalizedMsg.includes(word)) {
        keywords.push(word);
      }
    });

    // =========================================
    // CREAR REGEX GLOBAL
    // =========================================

    const regex = keywords.join("|");

    // =========================================
    // QUERY FLEXIBLE
    // =========================================

    let productsList = await Products.find({
      $or: [
        {
          nombre: {
            $regex: regex,
            $options: "i",
          },
        },
        {
          categoria: {
            $regex: regex,
            $options: "i",
          },
        },
        {
          subcategoria: {
            $regex: regex,
            $options: "i",
          },
        },
      ],
    })
      .select("nombre precioBase stockGeneral categoria subcategoria")
      .limit(10);

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
        content: `Sos el asistente oficial de una tienda especializada en productos Apple.

Tu función principal es responder usando EXCLUSIVAMENTE la información del catálogo enviado.

Reglas IMPORTANTES:
- Nunca inventes stock.
- Nunca inventes productos.
- Nunca inventes precios.
- Si un producto no aparece en el catálogo, decí claramente que no encontraste disponibilidad en la tienda.
- No respondas como Wikipedia o como soporte oficial de Apple.
- Priorizá SIEMPRE los productos de la tienda.
- Si preguntan por stock, respondé usando el catálogo.
- Si preguntan por fundas o accesorios, buscá productos relacionados en catálogo.
- Respondé breve, claro y con tono vendedor.
- Terminá con una pregunta corta orientada a la compra.

Si no existe información suficiente en el catálogo:
"Actualmente no encontré ese producto en el catálogo de la tienda."

Nunca recomiendes consultar Apple oficial.
Nunca digas que no tenés acceso al stock.
El stock disponible ES el enviado en el catálogo.`.trim(),
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
