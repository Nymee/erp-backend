const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client-controller");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/authorize-role");
const validate = require("../middlewares/validator");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validators/client.validator");

router.get("/", validate(createClientSchema), clientController.getClients);
router.post(
  "/",
  validate(updateClientSchema),
  authenticateUser,
  authorizeRoles("SAU"),
  clientController.createClient
);
router.get("/:client_id", clientController.getClientById);
router.patch("/:client_id", clientController.updateClient);

module.exports = router;
