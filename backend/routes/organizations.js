const express = require("express");
const {
  createOrganization,
  getOrganizationByCode,
} = require("../controllers/organization");

const router = express.Router();

router.post("/create", createOrganization);
router.get("/:code", getOrganizationByCode);

module.exports = router;