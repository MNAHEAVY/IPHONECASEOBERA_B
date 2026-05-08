const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
/* =========================
VARIANTE (motor real de inventario)
========================= */

const variantSchema = new Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  attributes: {
    // LEGACY
    color: String,

    // NUEVO
    colorKey: String,
    colorLabel: String,

    storage: String,
    model: String,
    size: String,
  },

  images: [String],

  available: {
    type: Boolean,
    default: true,
  },
});

/* =========================
PRODUCTO
========================= */

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    brand: {
      type: String,
      default: "Apple",
    },

    category: {
      type: String,
      enum: ["iphone", "ipad", "mac", "watch", "airpods", "accessorios", "otros"],
      required: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    description: String,

    basePrice: Number,

    images: [String],

    /* =========================
       COMPATIBILIDAD (clave para accesorios)
    ========================= */

    compatibleWith: {
      type: [
        {
          device: { type: String, trim: true },
          type: { type: String, trim: true },
        },
      ],
      default: [],
    },

    /* =========================
       VARIANTES
    ========================= */

    variants: [variantSchema],

    /* =========================
       INVENTARIO GLOBAL
    ========================= */

    totalStock: {
      type: Number,
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    /* =========================
       SEO
    ========================= */

    seo: {
      title: String,
      description: String,
    },

    /* =========================
       ANALYTICS
    ========================= */

    analytics: {
      views: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

/* =========================
AUTO CALCULAR STOCK TOTAL
========================= */

productSchema.pre("save", function (next) {
  // =========================
  // MIGRACIÓN AUTOMÁTICA DE COLORES
  // =========================

  this.variants = this.variants.map((variant) => {
    if (!variant.attributes) {
      variant.attributes = {};
    }

    // si ya tiene colorKey y colorLabel no hacemos nada
    if (variant.attributes.colorKey && variant.attributes.colorLabel) {
      return variant;
    }

    // tomamos el color viejo
    const legacyColor = variant.attributes.color || "";

    // generamos el colorKey automáticamente
    variant.attributes.colorKey = resolveColorKey(legacyColor);

    // guardamos el nombre visible
    variant.attributes.colorLabel = legacyColor || variant.attributes.colorKey;

    return variant;
  });

  // =========================
  // STOCK TOTAL
  // =========================

  const total = this.variants.reduce((acc, v) => acc + v.stock, 0);

  this.totalStock = total;
  this.available = total > 0;

  next();
});

/* =========================
ÍNDICES
========================= */

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ "variants.sku": 1 });

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
