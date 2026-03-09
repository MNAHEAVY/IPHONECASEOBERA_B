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
        sku: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          default: "",
        },
        image: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        subtotal: {
          type: Number,
          default: 0,
        },
        attributes: {
          color: {
            type: String,
            default: "",
          },
          model: {
            type: String,
            default: "",
          },
          storage: {
            type: String,
            default: "",
          },
        },
      },
    ],

    payment: {
      provider: {
        type: String,
        enum: ["mercadopago", "transfer", "cash", "card"],
        default: "mercadopago",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "completed"],
      default: "pending",
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
      subtotal: {
        type: Number,
        default: 0,
      },
      shipping: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
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
orderSchema.index({ status: 1 });

orderSchema.post("save", async function (doc) {
  if (doc.payment.status === "paid") {
    await updateUserStats(doc.user);
  }
});

module.exports = model("Order", orderSchema);
