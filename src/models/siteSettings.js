const mongoose = require("mongoose");

const topBarSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    strongText: {
      type: String,
      default: "Todavía hay tiempo",
      trim: true,
    },
    message: {
      type: String,
      default: "para comprar regalos que les encantarán.",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Comprar",
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "/products",
      trim: true,
    },
  },
  { _id: false },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    topBar: {
      type: topBarSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
