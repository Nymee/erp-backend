const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const companyController = require("../controllers/company-controller");

router.put("/status_update/:id", companyController.verifyCompany);

module.exports = router;
