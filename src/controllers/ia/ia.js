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

    const normalizedMsg = userMsg.toLowerCase().trim();

    // =========================================
    // DETECTAR INTENCIÓN
    // =========================================

    const intents = {
      compatibility: /(sirve|compatible|funciona|anda con|es para)/i.test(normalizedMsg),

      comparison: /(mejor|comparar|diferencia|vs)/i.test(normalizedMsg),

      recommendation: /(recomend|conviene|cual me aconsejas|que me aconsejas)/i.test(
        normalizedMsg,
      ),

      price: /(precio|cuesta|sale)/i.test(normalizedMsg),
    };

    // =========================================
    // EXTRAER KEYWORDS
    // =========================================

    const keywords = [];

    // =========================================
    // MODELOS IPHONE
    // =========================================

    const iphoneRegex = /(iphone\s?(1[1-6]|se|xr|xs)(\s?(pro|max|plus))?)/gi;

    const modelMatches = normalizedMsg.match(iphoneRegex);

    if (modelMatches) {
      modelMatches.forEach((match) => {
        keywords.push(match.toLowerCase());
      });
    }

    // =========================================
    // PALABRAS CLAVE / ALIASES
    // =========================================

    const keywordMap = {
      funda: ["funda", "fundas", "case"],
      cargador: ["cargador", "cargadores", "charger"],
      vidrio: ["templado", "vidrio", "glass"],
      airpods: ["airpods", "auriculares", "earpods"],

      iphone: ["iphone"],
      ipad: ["ipad"],
      mac: ["mac", "macbook", "imac"],
      watch: ["watch", "apple watch"],
    };

    Object.entries(keywordMap).forEach(([key, aliases]) => {
      aliases.forEach((alias) => {
        if (normalizedMsg.includes(alias)) {
          keywords.push(key);
        }
      });
    });

    // Eliminar duplicados
    const uniqueKeywords = [...new Set(keywords)];

    // =========================================
    // ARMAR REGEX FLEXIBLE
    // =========================================

    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = uniqueKeywords
      .map((k) => escapeRegex(k).replace(/\s+/g, ".*"))
      .join("|");

    // =========================================
    // BUSCAR PRODUCTOS
    // =========================================

    let productsList = [];

    if (uniqueKeywords.length > 0) {
      productsList = await Products.find({
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
        `,
        )
        .limit(30);
    }

    // =========================================
    // FALLBACK INTELIGENTE
    // =========================================

    if (productsList.length === 0) {
      productsList = await Products.find()
        .select(
          `
          name
          basePrice
          totalStock
          category
          subCategory
        `,
        )
        .limit(40);
    }

    // =========================================
    // DEBUG
    // =========================================

    console.log("=================================");
    console.log("USER:", userMsg);
    console.log("INTENTS:", intents);
    console.log("KEYWORDS:", uniqueKeywords);

    console.log(
      "PRODUCTOS:",
      productsList.map((p) => p.name),
    );

    console.log("=================================");

    // =========================================
    // FORMATEAR CATÁLOGO PARA IA
    // =========================================

    const catalogForAI = productsList.map((p) => ({
      name: p.name,
      price: p.basePrice,
      available: p.totalStock > 0 ? true : false,
      category: p.category,
      subCategory: p.subCategory,

      compatibility:
        p.compatibleWith?.map((c) => ({
          device: c.device,
          type: c.type,
        })) || [],
    }));

    // =========================================
    // MENSAJES
    // =========================================

    const conversationMessages = [
      {
        role: "system",

        content: `
Sos el asistente oficial de una tienda especializada en productos Apple y accesorios tecnológicos.

Tu personalidad:
- Experto en Apple
- Amigable
- Claro
- Profesional
- Breve
- Natural
- Comercial sin sonar agresivo

Tu objetivo principal:
Ayudar al usuario a encontrar el producto ideal y guiar naturalmente hacia la compra.

Podés responder:
- Compatibilidades
- Diferencias entre modelos Apple
- Comparaciones
- Recomendaciones
- Uso cotidiano
- Accesorios ideales
- Rendimiento
- Batería
- Cámaras
- Pantallas

IMPORTANTE:
- Para información técnica general sobre Apple podés usar conocimiento general.
- Para precios y disponibilidad usás EXCLUSIVAMENTE el catálogo enviado.
- Nunca inventes stock.
- Nunca inventes precios.
- Nunca inventes productos.
- Si no encontrás un producto, decilo claramente.
- Nunca muestres estructuras internas del catálogo.

Reglas comerciales:
- Priorizá productos disponibles.
- Recomendá máximo 3 productos.
- Si hay accesorios relacionados, sugerilos naturalmente.
- Destacá beneficios reales.
- Respondé de forma humana.
- Evitá respuestas robóticas.
- Evitá párrafos largos.
- Terminá siempre con una pregunta corta para continuar la conversación.

Información extra:
${JSON.stringify(intents)}
        `.trim(),
      },

      {
        role: "system",
        content: `
CATALOGO DISPONIBLE:
${JSON.stringify(catalogForAI)}
        `,
      },

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
      model: "gpt-5-mini",
      messages: conversationMessages,
    });

    // =========================================
    // RESPONSE
    // =========================================

    return res.json({
      reply: aiResponse.choices[0].message.content,
    });
  } catch (error) {
    console.error("CHAT AI ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};
