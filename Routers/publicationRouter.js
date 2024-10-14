const express = require("express");
const { createPublication, getPublications } = require("../Controllers/publicationController");
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();

// Create a publication (requires token)
router.post("/", validateToken, createPublication);

// Get all publications (public access)
router.get("/", getPublications);

module.exports = router;
