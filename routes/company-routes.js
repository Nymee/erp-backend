const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company-controller");
const validate = require("../middlewares/validator");
const { verifyCompanySchema } = require("../validators/company.validator");
const authenticateUser = require("../middlewares/authenticate-user");
const authorizeRoles = require("../middlewares/authorize-role");

router.put(
  "/status_update/:id",
  authorizeRoles("ADMIN"),
  validate(verifyCompanySchema),
  companyController.verifyCompany
);
router.get(
  "/",
  authorizeRoles("ADMIN"),
  companyController.getCompanies
);

module.exports = router;
