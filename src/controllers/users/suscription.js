const User = require("../../models/users");

const suscriptorSucceded = async (req, res) => {
  const { payer, parametro } = req.body; // Extrae el parámetro del cuerpo de la solicitud
  const level = parametro;

  await User.findByIdAndUpdate(
    payer._id, // Solo pasa el ID del usuario
    {
      isSuscribed: true,
      suscribedLevel: parametro,
    }
  );

  // Envía una respuesta al cliente si es necesario
  res.status(200).json({ message: "Purchase successful" });
};

module.exports = { suscriptorSucceded };
