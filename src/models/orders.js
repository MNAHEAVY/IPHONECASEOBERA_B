const updateUserStats = require("../utils/updateUserStats");

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],

    payment: {
      method: {
        type: String,
        enum: ["mercadopago", "transfer", "cash", "card"],
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },

    shipping: {
      address: {
        country: String,
        state: String,
        city: String,
        street_name: String,
        street_number: Number,
        codigo_postal: String,
      },
      status: {
        type: String,
        enum: ["preparing", "shipped", "delivered", "cancelled"],
        default: "preparing",
      },
      trackingNumber: String,
    },

    totals: {
      subtotal: Number,
      shippingCost: Number,
      discount: Number,
      total: Number,
    },

    currency: {
      type: String,
      default: "ARS",
    },

    notes: String,
  },
  { timestamps: true },
);

/* =========================
   ÍNDICES
========================= */
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "payment.status": 1 });

orderSchema.post("save", async function (doc) {
  if (doc.payment.status === "paid") {
    await updateUserStats(doc.user);
  }
});

module.exports = model("Order", orderSchema);
