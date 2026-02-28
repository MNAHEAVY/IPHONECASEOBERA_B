const User = require("../../models/users");

const getUsers = async (req, res) => {
  const users = await User.find({});
  try {
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = getUsers;
