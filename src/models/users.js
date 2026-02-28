const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    /* =========================
       AUTH / IDENTIDAD
    ========================== */
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String },
    email_verified: { type: Boolean, default: false },

    given_name: { type: String, required: true },
    family_name: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    sub: { type: String },
    locale: { type: String },

    phone: { type: String },

    identification: {
      verify: { type: Boolean, default: false },
      type: { type: String },
      number: { type: String },
    },

    address: {
      verify: { type: Boolean, default: false },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      street_name: { type: String },
      street_number: { type: Number },
      codigo_postal: { type: String },
    },

    /* =========================
       ROLES
    ========================== */
    role: {
      type: String,
      enum: ["user", "admin", "support"],
      default: "user",
    },

    isBanned: { type: Boolean, default: false },

    /* =========================
       MÉTRICAS COMERCIALES
    ========================== */
    stats: {
      totalSpent: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      averageTicket: { type: Number, default: 0 },
      firstPurchaseAt: { type: Date },
      lastPurchaseAt: { type: Date },
    },

    customerState: {
      type: String,
      enum: ["new", "active", "recurrent", "vip", "inactive"],
      default: "new",
    },

    /* =========================
       COMPORTAMIENTO
    ========================== */
    behavior: {
      lastLogin: { type: Date },
      lastSeen: { type: Date },
      abandonedCart: { type: Boolean, default: false },
      viewedProducts: [{ type: Schema.Types.ObjectId, ref: "products" }],
    },

    /* =========================
       SEGURIDAD
    ========================== */
    security: {
      registerIP: String,
      lastIP: String,
      loginAttempts: { type: Number, default: 0 },
      refunds: { type: Number, default: 0 },
      cancellations: { type: Number, default: 0 },
    },

    /* =========================
       FIDELIDAD
    ========================== */
    isSuscribed: { type: Boolean, default: false },
    suscribedLevel: { type: Number, default: 0 },
    hasDiscount: { type: Boolean, default: false },
    oberCoins: { type: Number, default: 0 },

    /* =========================
       PERFIL APPLE (CLAVE PARA VOS)
    ========================== */
    appleProfile: {
      devices: [String], // iPhone 15, MacBook Air M1, etc
      preferredDevice: String,
      ecosystemLevel: { type: Number, default: 0 },
    },

    /* =========================
       RELACIONES
    ========================== */
    favorites: [{ type: Schema.Types.ObjectId, ref: "favorite" }],
    cart: [{ type: Schema.Types.ObjectId, ref: "cart" }],

    terms: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* =========================
   ÍNDICES
========================= */
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ "stats.totalSpent": -1 });
userSchema.index({ customerState: 1 });
userSchema.index({ role: 1 });

module.exports = model("User", userSchema);
module.exports = User;
