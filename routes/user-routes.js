const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/verify-user");

router.get("/", authenticateUser, userController.getUsers);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("SAU"),
  userController.createUser
);
router.get("/:user_id", userController.getUserById);
router.put("/:user_id", userController.updateUser);

module.exports = router;
