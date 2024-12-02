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

// File filter for PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter }); // Initialize multer

const createPublication = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const image = req.files?.image
    ? `http://localhost:5001/${req.files.image[0].path.replace(/\\/g, "/")}`
    : null;
  const pdf = req.files?.pdf
    ? `http://localhost:5001/${req.files.pdf[0].path.replace(/\\/g, "/")}`
    : null;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  const publication = await Publication.create({
    title,
    content,
    image,
    pdf, // Save PDF file URL
    user: req.user.id,
  });

  res.status(201).json(publication);
});



const getPublications = asyncHandler(async (req, res) => {
  const publications = await Publication.find()
    .populate("user", "username email");

  // Map over publications to update image and PDF URLs
  const updatedPublications = publications.map((publication) => {
    if (publication.image && !publication.image.startsWith("http")) {
      publication.image = `http://localhost:5001/${publication.image.replace(/\\/g, "/")}`;
    }
    if (publication.pdf && !publication.pdf.startsWith("http")) {
      publication.pdf = `http://localhost:5001/${publication.pdf.replace(/\\/g, "/")}`;
    }
    return publication;
  });

  res.status(200).json(updatedPublications);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Update a comment on a publication
const updateComment = asyncHandler(async (req, res) => {
  const { commentId, text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Updated comment text is required!");
  }

  const publication = await Publication.findById(req.params.id);

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  // Find the comment
  const comment = publication.comments.id(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check if the user owns the comment
  if (comment.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You are not authorized to update this comment");
  }

  // Update the comment
  comment.text = text;
  await publication.save();

  res.status(200).json(publication.comments);
});
 

// Delete a comment from a publication
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  const publication = await Publication.findById(req.params.id);

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  // Find the comment
  const comment = publication.comments.id(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check if the user owns the comment
  if (comment.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You are not authorized to delete this comment");
  }

  // Remove the comment
  comment.remove();
  await publication.save();

  res.status(200).json(publication.comments);
});
 

// Add a comment to a publication
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Comment text is required!");
  }

  const publication = await Publication.findById(req.params.id);

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  const comment = {
    user: req.user.id,
    text,
  };

  publication.comments.push(comment);
  await publication.save();

  res.status(201).json(publication.comments);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const getPublicationById = asyncHandler(async (req, res) => {
  const publication = await Publication.findById(req.params.id)
    .populate("user", "username email")
    .populate("comments.user", "username email");

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  // Generate full URLs for image and PDF if they exist
  if (publication.image && !publication.image.startsWith("http")) {
    publication.image = `http://localhost:5001/${publication.image.replace(/\\/g, "/")}`;
  }
  if (publication.pdf && !publication.pdf.startsWith("http")) {
    publication.pdf = `http://localhost:5001/${publication.pdf.replace(/\\/g, "/")}`;
  }

  res.status(200).json(publication);
});


const updateImages = async () => {
  const publications = await Publication.find();
  for (const publication of publications) {
    if (publication.image && !publication.image.startsWith('http')) {
      publication.image = `http://localhost:5001/${publication.image.replace(/\\/g, '/')}`;
      await publication.save();
    }
  }
  console.log("Updated all publication images!");
};

updateImages();



module.exports = {
  createPublication,
  getPublications,
  upload,
  likePublication,
  unlikePublication,
  addComment,
  getPublicationById,
  deleteComment,
  updateComment,
};
