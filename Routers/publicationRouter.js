const express = require("express");
const { createPublication, getPublications } = require("../Controllers/publicationController");
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();


router.post("/", validateToken, createPublication);


router.get("/", getPublications);

module.exports = router;
