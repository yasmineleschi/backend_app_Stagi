const express = require("express");
const { createPublication,
        getPublications, 
        upload , 
        likePublication,
        unlikePublication } = require("../Controllers/publicationController");
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, upload.single("image"), createPublication); // Handle image upload with multer
router.get("/", getPublications);
router.patch("/:id/like", validateToken, likePublication);
router.patch("/:id/unlike", validateToken, unlikePublication);

module.exports = router;
