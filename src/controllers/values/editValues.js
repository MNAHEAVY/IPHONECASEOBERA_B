const Values = require("../../models/values");

const updateValues = async (req, res) => {
  const { id } = req.params;

  try {
    // Al pasar req.body directamente, Mongoose solo actualizará los campos que envías.
    // { new: true, runValidators: true } asegura que devuelva el objeto nuevo y ejecute las validaciones del Modelo.
    const updatedValues = await Values.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedValues) {
      return res.status(404).json({ message: "Values not found" });
    }

    return res.status(200).json(updatedValues);
  } catch (error) {
    console.error("Backend Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = updateValues;
