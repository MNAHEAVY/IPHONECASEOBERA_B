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
    // KEYWORDS
    // =========================================

    const keywords = [];

    // =========================================
    // MODELOS IPHONE
    // =========================================

    const modelMatch = normalizedMsg.match(
      /(iphone\s?\d+\s?(pro|max|plus)?|\d+\s?(pro|max|plus)?)/gi,
    );

    if (modelMatch) {
      keywords.push(...modelMatch);

      // Agregar versión con "iphone"
      modelMatch.forEach((m) => {
        if (!m.includes("iphone")) {
          keywords.push(`iphone ${m}`);
        }
      });
    }

    // =========================================
    // PALABRAS CLAVE / ALIASES
    // =========================================

    const keywordMap = {
      funda: ["funda", "fundas", "case"],
      cargador: ["cargador", "cargadores", "charger"],
      vidrio: ["templado", "vidrio", "glass", "glasses"],
      airpods: ["airpods", "auriculares", "earpods"],

      iphone: ["iphone"],
      ipad: ["ipad"],
      mac: ["mac", "macbook", "imac"],
      watch: ["watch", "apple watch"],
    };

    Object.entries(keywordMap).forEach(([_, aliases]) => {
      aliases.forEach((alias) => {
        if (normalizedMsg.includes(alias)) {
          keywords.push(alias);
        }
      });
    });

    // =========================================
    // SI NO HAY KEYWORDS
    // =========================================

    if (keywords.length === 0) {
      return res.json({
        reply:
          "Puedo ayudarte con consultas sobre iPhone, Mac, iPad, Apple Watch, AirPods, fundas y accesorios Apple 🙂",
      });
    }

    // =========================================
    // REGEX FLEXIBLE
    // =========================================
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = keywords.map((k) => escapeRegex(k).replace(/\s+/g, ".*")).join("|");
    // =========================================
    // BUSCAR PRODUCTOS
    // =========================================

    let productsList = await Products.find({
      $or: [
        {
          name: {
            $regex: regex,
            $options: "i",
          },
        },

        {
          category: {
            $regex: regex,
            $options: "i",
          },
        },

        {
          subCategory: {
            $regex: regex,
            $options: "i",
          },
        },

        {
          "compatibleWith.device": {
            $regex: regex,
            $options: "i",
          },
        },

        {
          "compatibleWith.type": {
            $regex: regex,
            $options: "i",
          },
        },

        {
          "variants.attributes.model": {
            $regex: regex,
            $options: "i",
          },
        },
      ],
    })
      .select(
        `
  name
  basePrice
  totalStock
  category
  subCategory
  compatibleWith
  variants
`,
      )
      .limit(15);

    // =========================================
    // FALLBACK INTELIGENTE
    // =========================================

    // Si no encuentra resultados,
    // enviar más catálogo a GPT para
    // matching semántico
    if (productsList.length === 0) {
      productsList = await Products.find()
        .select("name priceBase stock category subCategory")
        .limit(250);
    }

    // =========================================
    // DEBUG
    // =========================================

    console.log("USER:", userMsg);

    console.log("KEYWORDS:", keywords);

    console.log(
      "PRODUCTOS ENCONTRADOS:",
      productsList.map((p) => p.name),
    );

    // =========================================
    // FORMATEAR CATÁLOGO
    // =========================================

    const productText = productsList
      .map((p) => {
        const compatibility = p.compatibleWith
          ?.map((c) => `${c.device} (${c.type})`)
          .join(", ");

        return `
• ${p.name}

Precio: $${p.basePrice}
Stock: ${p.totalStock}
Categoría: ${p.category}
Subcategoría: ${p.subCategory}

Compatibilidad:
${compatibility || "No especificada"}
`;
      })
      .join("\n\n");

    // =========================================
    // MENSAJES PARA OPENAI
    // =========================================

    const conversationMessages = [
      {
        role: "system",
        content:
          `Sos el asistente oficial de una tienda especializada en productos Apple y accesorios tecnológicos.

Tu personalidad:
- Experto en Apple
- Amigable
- Claro
- Profesional
- Breve
- Con tono vendedor pero natural

Podés responder:
- Diferencias entre modelos Apple
- Características y especificaciones
- Compatibilidades
- Recomendaciones de compra
- Consejos sobre productos Apple
- Comparaciones entre dispositivos
- Dudas sobre rendimiento, cámaras, batería, pantallas y uso cotidiano

IMPORTANTE:
- Para información técnica general sobre Apple, podés usar tu conocimiento general.
- Para precios, stock y disponibilidad, usás EXCLUSIVAMENTE el catálogo enviado.
- Nunca inventes stock.
- Nunca inventes precios.
- Nunca inventes productos inexistentes.
- Si un producto no aparece en el catálogo, indicá claramente que no encontraste disponibilidad en la tienda.

Reglas comerciales:
- Priorizá siempre los productos disponibles en la tienda.
- Si preguntan por accesorios o fundas, sugerí productos relacionados del catálogo.
- Explicá beneficios reales de los productos, no solo especificaciones.
- Respondé de forma clara y natural, evitando respuestas robóticas.
- Terminá la respuesta con una pregunta corta orientada a continuar la conversación o la compra.

Nunca:
- digas que no tenés acceso al stock
- recomiendes consultar Apple oficial
- respondas como soporte técnico oficial Apple
- inventes información comercial

El catálogo enviado representa el stock real de la tienda.`.trim(),
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
