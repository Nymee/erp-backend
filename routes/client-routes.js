const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client-controller");

router.get("/", authenticateUser, clientController.getClients);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("SAU"),
  clientController.createClient
);
router.get("/:user_id", clientController.getClientById);
router.patch("/:user_id", clientController.updateClient);
