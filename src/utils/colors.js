const normalizeText = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/* =========================
   MAPEO DE KEYWORDS
========================= */

const COLOR_KEYWORDS = {
  black: [
    "black",
    "negro",
    "midnight",
    "graphite",
    "space black",
    "jet black",
    "stone black",
    "grey black",
  ],

  white: ["white", "blanco", "white titanium"],

  gray: [
    "gray",
    "grey",
    "gris",
    "silver",
    "space gray",
    "space grey",
    "natural titanium",
    "plata",
    "stone gray",
    "ceniza",
  ],

  blue: [
    "blue",
    "azul",
    "sierra blue",
    "pacific blue",
    "royal navy",
    "royal navy blue",
    "midnight blue",
    "light-blue",
    "light blue",
    "celeste",
    "azure",
    "zafiro",
    "navy",
    "petroleo",
    "petroleum",
    "aqua",
    "menta",
    "ice",
  ],

  green: [
    "green",
    "verde",
    "alpine green",
    "midnight green",
    "militar",
    "olive",
    "olio",
    "tendril",
    "primavera",
    "musgo",
    "citrico",
  ],

  red: [
    "red",
    "rojo",
    "ruby",
    "rubi",
    "vinotinto",
    "vino",
    "bordo",
    "cherry",
    "cereza",
    "magenta",
    "fucsia",
    "fuscia",
    "coral fuerte",
  ],

  pink: [
    "pink",
    "rosa",
    "rose",
    "rose gold",
    "pink sand",
    "perla",
    "pastel",
    "palido",
    "suave",
    "fluor",
    "bubblegum",
  ],

  purple: [
    "purple",
    "purpura",
    "deep purple",
    "ultra violeta",
    "violeta",
    "lila",
    "lilac",
    "uva",
  ],

  yellow: ["yellow", "amarillo", "gold", "dorado", "golden", "limon"],

  orange: ["orange", "naranja", "durazno", "peach", "salmon", "salmon", "coral"],

  brown: ["brown", "marron", "marrón", "leather brown"],

  beige: ["beige", "crema", "cream", "starlight", "marfil", "nude", "sand", "stone"],

  transparent: ["transparent", "clear"],
};

/* =========================
   RESOLVER COLOR
========================= */

const resolveColorKey = (value = "") => {
  const normalized = normalizeText(value);

  for (const [colorKey, keywords] of Object.entries(COLOR_KEYWORDS)) {
    const found = keywords.some((keyword) => normalized.includes(keyword));

    if (found) {
      return colorKey;
    }
  }

  return "gray";
};

module.exports = {
  resolveColorKey,
};
