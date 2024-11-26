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






const getPublicationById = asyncHandler(async (req, res) => {
  const publication = await Publication.findById(req.params.id)
    .populate("user", "username email")
    .populate("comments.user", "username email");

  if (!publication) {
    res.status(404);
    throw new Error("Publication not found");
  }

  console.log(publication); // Debugging
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
};
