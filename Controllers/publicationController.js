const asyncHandler = require("express-async-handler");
const Publication = require("../Models/Publication");
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }); // Initialize multer with storage configuration

// Create a new publication with an optional image
const createPublication = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null; // Save image path if provided

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  const publication = await Publication.create({
    title,
    content,
    image, // Save image path
    user: req.user.id,
  });

  res.status(201).json(publication);
});

// Get all publications
const getPublications = asyncHandler(async (req, res) => {
  const publications = await Publication.find().populate("user", "username email");
  res.status(200).json(publications);
});

const likePublication = asyncHandler(async (req, res) => {
  const publication = await Publication.findById(req.params.id);

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  publication.likes += 1;
  await publication.save();
  res.status(200).json({ likes: publication.likes });
});

// Unlike a publication
const unlikePublication = asyncHandler(async (req, res) => {
  const publication = await Publication.findById(req.params.id);

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  if (publication.likes > 0) {
    publication.likes -= 1;
    await publication.save();
  }
  res.status(200).json({ likes: publication.likes });
});

module.exports = { createPublication, getPublications, upload , likePublication, unlikePublication  };
