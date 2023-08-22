const Values = require("../../models/values");

//Get one by id

const getValues = async (req, res) => {
  try {
    const one = await Values.findById({ _id: "64e5303ef2a4091d4a11ec20" });
    if (!one) {
      return res.status(404).json({ message: "Values not found" });
    }
    return res.status(200).json(one);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = getValues;
