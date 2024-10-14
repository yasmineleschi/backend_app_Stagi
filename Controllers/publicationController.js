const asyncHandler = require("express-async-handler");
const Publication = require("../Models/Publication");

// Create a new publication
const createPublication = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  const publication = await Publication.create({
    title,
    content,
    user: req.user.id, // Comes from validated JWT token
  });

  res.status(201).json(publication);
});

// Get all publications
const getPublications = asyncHandler(async (req, res) => {
  const publications = await Publication.find().populate("user", "username email");
  res.status(200).json(publications);
});

module.exports = { createPublication, getPublications };
