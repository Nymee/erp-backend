const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const companyController = require("../controllers/company-controller");
const validate = require("../validators/company.validator");

router.put(
  "/status_update/:id",
  validate(verifyCompanySchema),
  companyController.verifyCompany
);

module.exports = router;
