const express = require("express");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const Publication = require("../Models/Publication");

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter }); // Initialize multer

// Controller for creating a publication
const createPublication = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const image = req.files?.image ? `http://localhost:5001/${req.files.image[0].path.replace(/\\/g, "/")}` : null;
  const pdf = req.files?.pdf ? `http://localhost:5001/${req.files.pdf[0].path.replace(/\\/g, "/")}` : null;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  const publication = await Publication.create({
    title,
    content,
    image,
    pdf,
    user: req.user.id,
  });

  res.status(201).json(publication);
});

