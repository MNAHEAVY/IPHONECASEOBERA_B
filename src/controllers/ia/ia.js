const OpenAI = require("openai");
const Products = require("../../models/products");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const userMsg = req.body.message;

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
    // BUSCADOR INTELIGENTE
    // =========================================

    let searchQuery = {};

    // Detectar modelos Apple
    const modelMatch = normalizedMsg.match(
      /(iphone\s?\d+|iphone\s?\d+\s?pro|max|plus|airpods|ipad|macbook|watch)/i,
    );

    if (modelMatch) {
      searchQuery.nombre = {
        $regex: modelMatch[0],
        $options: "i",
      };
    }

    // Detectar fundas / cases
    if (normalizedMsg.includes("funda") || normalizedMsg.includes("case")) {
      searchQuery.tipo = {
        $regex: "funda|case",
        $options: "i",
      };
    }

    // Detectar cargadores
    if (normalizedMsg.includes("cargador") || normalizedMsg.includes("charger")) {
      searchQuery.tipo = {
        $regex: "cargador|charger",
        $options: "i",
      };
    }

    // Detectar vidrios
    if (normalizedMsg.includes("vidrio") || normalizedMsg.includes("templado")) {
      searchQuery.tipo = {
        $regex: "vidrio|templado",
        $options: "i",
      };
    }

    // =========================================
    // CONSULTA DB
    // =========================================

    let productsList = await Product.find(searchQuery)
      .select("nombre precioBase stockGeneral tipo")
      .limit(10);

    // =========================================
    // FALLBACK SI NO ENCUENTRA PRODUCTOS
    // =========================================

    if (productsList.length === 0) {
      productsList = await Product.find()
        .select("nombre precioBase stockGeneral tipo")
        .limit(5);
    }

    // =========================================
    // FORMATEAR CATÁLOGO
    // =========================================

    const productText = productsList
      .map(
        (p) =>
          `• ${p.nombre} — $${p.precioBase} — Stock: ${p.stockGeneral} — Tipo: ${p.tipo}`,
      )
      .join("\n");

    // =========================================
    // OPENAI
    // =========================================

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,

      messages: [
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
          content: `Catálogo disponible:\n${productText}`,
        },
        {
          role: "user",
          content: userMsg,
        },
      ],
    });

    res.json({
      reply: aiResponse.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat controller error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { chatWithAI };
