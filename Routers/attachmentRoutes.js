const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const { uploadFile, getAttachments, viewAttachment } = require("../Controllers/attachmentController");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/:studentId", getAttachments);
router.get("/view/:filename", viewAttachment);

module.exports = router;
