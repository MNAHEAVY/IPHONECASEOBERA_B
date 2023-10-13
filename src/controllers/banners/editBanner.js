const Banner = require("../../models/banners");

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen, enlace, orden, activo } = req.body;

  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        titulo,
        descripcion,
        imagen,
        enlace,
        orden,
        activo,
      },
      { new: true }
    );
    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    return res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateBanner;
