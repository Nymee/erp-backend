const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/authorize-role");

router.get("/", authenticateUser, userController.getUsers);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("SAU"),
  userController.createUser 
);
router.get("/:user_id", authenticateUser, userController.getUserById);
router.patch("/:user_id", authenticateUser, userController.updateUser);

module.exports = router;
