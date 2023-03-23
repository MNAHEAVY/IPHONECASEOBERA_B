const Values = require("../../models/values");

//Get one by id

const getValues = async (req, res) => {
  try {
    const one = await Values.findById({ _id: "6410febef7d62550d5b0754c" });
    if (!one) {
      return res.status(404).json({ message: "Values not found" });
    }
    return res.status(200).json(one);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = getValues;
