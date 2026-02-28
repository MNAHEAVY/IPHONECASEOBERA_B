const { Router } = require("express");
const getUsers = require("../controllers/users/getUsers");
const getUser = require("../controllers/users/getUser");
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUser);

module.exports = router;
