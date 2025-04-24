const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const companyController = require("../controllers/companyController");

router.put("/status_update/:id", companyController.verifyCompany);

module.exports = router;
