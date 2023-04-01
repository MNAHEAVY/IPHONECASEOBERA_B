const Values = require("../../models/values");

const updateValues = async (req, res) => {
  const { id } = req.params;
  const {
    dolarBlue,
    dolarOficial,
    packaginPremium,
    packagingSimple,
    costoGeneral,
    flete,
    profit,
  } = req.body;

  try {
    const updatedValues = await Values.findByIdAndUpdate(
      id,
      {
        dolarBlue,
        dolarOficial,
        packaginPremium,
        packagingSimple,
        costoGeneral,
        flete,
        profit,
      },
      { new: true }
    );
    if (!updatedValues) {
      return res.status(404).json({ message: "Values not found" });
    }
    return res.status(200).json(updatedValues);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateValues;
