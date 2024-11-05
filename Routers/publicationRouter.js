const express = require("express");
const { createPublication, getPublications, upload } = require("../Controllers/publicationController");
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, upload.single("image"), createPublication); // Handle image upload with multer
router.get("/", getPublications);

module.exports = router;
