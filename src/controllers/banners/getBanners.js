const Banner = require("../../models/banners");

//Get all Banners

const getBanner = async (req, res) => {
  const bann = await Banner.find({});
  try {
    return res.status(200).json(bann);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = getBanner;
