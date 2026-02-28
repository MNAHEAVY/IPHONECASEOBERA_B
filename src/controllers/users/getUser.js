const User = require("../../models/users");

const getUsers = async (req, res) => {
  const users = await User.find({});
  try {
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const one = await User.findOne({ _id: req.params.id });
    if (!one) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(one);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { getUser, getUsers };
