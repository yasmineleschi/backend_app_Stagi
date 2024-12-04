const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDirectory = path.resolve(__dirname, "../uploadsAttachment");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {

    const originalName = file.originalname.replace(/\s/g, "_");
    cb(null, originalName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Type de fichier invalide. Seuls PDF, JPEG et PNG sont autorisés."));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = upload;
