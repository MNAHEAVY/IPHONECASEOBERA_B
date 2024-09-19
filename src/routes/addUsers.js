const express = require("express");

const User = require("../../src/models/users");
const Favorite = require("../../src/models/favs");
const Cart = require("../../src/models/cart");

const router = express.Router();

// route for get user
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/users", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
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
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
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
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          address: req.body.address,
          payment: req.body.payment,
          cart: req.body.cart,
          favorites: req.body.favorites,
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

router.put("/useredit/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body; // The updated user data sent in the request body

    // Use findByIdAndUpdate to update the user data based on the user's ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updatedUserData, // Update the user data with the new data from the request body
      },
      { new: true } // Return the updated user data
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, you can send the updated user data in the response
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/:userId/cart", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("cart");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error al obtener el carrito del usuario" });
  }
});

router.get("/users/:userId/favs", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error al obtener el carrito del usuario" });
  }
});

router.post("/users/cart", async (req, res) => {
  try {
    const {
      userId,
      nombre,
      imagen,
      stock,
      precio,
      color,
      productId,
      cantidad,
      modelo,
      capacidad,
    } = req.body;

    const newItem = {
      product: productId,
      name: nombre,
      image: imagen,
      stock,
      color,
      model: modelo,
      capacidad,
      price: precio,
      quantity: cantidad,
      user: userId,
    };

    const user = await User.findById(userId).populate("cart");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isProductInCart = user.cart.some(
      (item) =>
        item.color === color && item.model === modelo && item.capacidad === capacidad
    );
    if (isProductInCart) {
      return res.status(400).json({
        message: "El producto ya está en el carrito o una variante del mismo",
      });
    }

    const cart = new Cart(newItem);
    await cart.save();

    user.cart.push(cart);
    await user.save();
    res.status(200).json(cart.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito" });
  }
});

router.post("/users/favs", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId).populate("favorites"); // Populate para obtener los favoritos

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isProductInFavorites = user.favorites.some((favorite) =>
      favorite.product.equals(productId)
    );

    if (isProductInFavorites) {
      return res
        .status(400)
        .json({ error: "El producto ya está en la lista de favoritos" });
    }

    const newFavorite = new Favorite({
      product: productId,
      user: userId,
    });

    await newFavorite.save();

    user.favorites.push(newFavorite);
    await user.save();

    res.status(200).json(newFavorite.toObject());
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al agregar el producto a favoritos" });
  }
});

router.delete("/users/cart/:userId/:itemId", async (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;

  try {
    const cartItem = await Cart.findOneAndDelete({
      user: userId,
      _id: itemId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Remove the item from the user's cart array
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: itemId },
    });

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/users/favs/:userId/:itemId", async (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;

  try {
    const favsItem = await Favorite.findOneAndDelete({
      user: userId,
      _id: itemId,
    });

    if (!favsItem) {
      return res.status(404).json({ message: "Favs item not found" });
    }

    // Remove the item from the user's cart array
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: itemId },
    });

    res.status(200).json({ message: "favs item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
