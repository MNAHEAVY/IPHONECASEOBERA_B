const SiteSettings = require("../../models/siteSettings");

const defaultSettings = {
  topBar: {
    enabled: true,
    strongText: "Todavía hay tiempo",
    message: "para comprar regalos que les encantarán.",
    buttonText: "Comprar",
    buttonLink: "/products",
  },
};

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(defaultSettings);
  }

  return settings;
};

const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTopBarSettings = async (req, res) => {
  try {
    const { enabled, strongText, message, buttonText, buttonLink } = req.body;

    let settings = await getOrCreateSettings();

    settings.topBar = {
      enabled: typeof enabled === "boolean" ? enabled : settings.topBar.enabled,
      strongText:
        typeof strongText === "string" ? strongText : settings.topBar.strongText,
      message: typeof message === "string" ? message : settings.topBar.message,
      buttonText:
        typeof buttonText === "string" ? buttonText : settings.topBar.buttonText,
      buttonLink:
        typeof buttonLink === "string" ? buttonLink : settings.topBar.buttonLink,
    };

    await settings.save();

    res.status(200).json({
      message: "Top bar actualizada correctamente",
      settings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSiteSettings,
  updateTopBarSettings,
};
