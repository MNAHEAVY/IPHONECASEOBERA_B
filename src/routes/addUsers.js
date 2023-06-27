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
    const user = await Users.findOne({ email }).populate("cart favorites");
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
    };

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isProductInCart = user.cart.some((item) => item.name === nombre);
    if (isProductInCart) {
      return res.status(400).json({
        error: "El producto ya está en el carrito o una variante del mismo",
      });
    }

    user.cart.push(newItem);
    await user.save();

    res
      .status(200)
      .json({ message: "Producto agregado al carrito correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al agregar el producto al carrito" });
  }
});
router.post("/users/favs", async (req, res) => {
  try {
    const { userId, productId } = req.body; // Recibe el ID del usuario y el ID del producto desde el cuerpo de la solicitud

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el producto ya está en la lista de favoritos
    const isProductInFavorites = user.favorites.includes(productId);
    if (isProductInFavorites) {
      return res
        .status(400)
        .json({ error: "El producto ya está en la lista de favoritos" });
    }

    user.favorites.push(productId);
    await user.save();

    res.json(user.favorites); // Devuelve los favoritos actualizados como respuesta
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al agregar el producto a favoritos" });
  }
});

router.delete("/users/cart/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params; // Recibe el ID del usuario y el ID del elemento a eliminar desde los parámetros de la solicitud

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el elemento existe en el carrito
    const itemIndex = user.cart.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "El elemento no existe en el carrito" });
    }

    user.cart.splice(itemIndex, 1); // Eliminar el elemento del carrito
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al eliminar el elemento del carrito" });
  }
});

router.delete("/users/favs/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params; // Recibe el ID del usuario y el ID del producto a eliminar desde los parámetros de la solicitud

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el producto existe en la lista de favoritos
    const productIndex = user.favorites.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "El producto no existe en la lista de favoritos" });
    }

    user.favorites.splice(productIndex, 1); // Eliminar el producto de la lista de favoritos
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al eliminar el producto de favoritos" });
  }
});

module.exports = router;
