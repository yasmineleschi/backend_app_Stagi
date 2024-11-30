const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const { uploadFile, getAttachments } = require("../Controllers/attachmentController");

router.post("/upload", upload.single('file'), uploadFile);

router.get("/:studentId", getAttachments);

module.exports = router;
