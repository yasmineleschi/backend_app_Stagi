const express = require("express");
const {
  createPublication,
  getPublications,
  upload,
  likePublication,
  unlikePublication,
  addComment,
  getPublicationById, // Import the new function
} = require("../Controllers/publicationController");
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();

router.post("/", validateToken, upload.single("image"), createPublication); // Handle image upload with multer
router.get("/", getPublications);
router.get("/:id", validateToken, getPublicationById); // New route for fetching publication details
router.patch("/:id/like", validateToken, likePublication);
router.patch("/:id/unlike", validateToken, unlikePublication);
router.post("/:id/comment", validateToken, addComment);

module.exports = router;
