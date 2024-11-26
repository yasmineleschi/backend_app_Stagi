const asyncHandler = require("express-async-handler");
const Attachment = require("../Models/Attachment");
const Student = require("../Models/Student");

const uploadFile = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const attachment = new Attachment({
      studentId,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    await attachment.save();

    student.attachments.push(attachment._id);
    await student.save();

    res.status(201).json({ message: "File uploaded successfully", attachment });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getAttachments = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate("attachments");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student.attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  uploadFile,
  getAttachments,
};
