const express = require("express");

const Users = require("../../src/models/users");

const router = express.Router();

// route for get user
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await Users.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/users", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await Users.findOne({ email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error interno del servidor");
  }
});
// Route for creating a new user

router.post("/users", async (req, res) => {
  const {
    email,
    email_verified,
    family_name,
    given_name,
    locale,
    name,
    nickname,
    picture,
    sub,
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new Users({
      email,
      email_verified,
      family_name,
      given_name,
      locale,
      name,
      nickname,
      picture,
      auth0Id: sub,
    });
    await newUser.save();

    // Send the new user data back to the client
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          address: req.body.address,
          payment: req.body.payment,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
