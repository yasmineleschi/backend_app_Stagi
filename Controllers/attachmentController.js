const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const Attachment = require("../Models/Attachment");
const Student = require("../Models/Student");


const uploadFile = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé." });
  }

 
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ error: "Étudiant introuvable." });
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

  res.status(201).json({
    message: "Fichier téléchargé avec succès.",
    attachment: {
      ...attachment.toObject(),
      filePath: `${req.protocol}://${req.get('host')}/api/attachment/view/${req.file.filename}`,
    },
  });
  
});


const getAttachments = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId).populate("attachments");
  if (!student) {
    return res.status(404).json({ error: "Étudiant introuvable." });
  }

  res.status(200).json(student.attachments);
});

const viewAttachment = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, "../uploadsAttachment", filename);


  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fichier introuvable." });
  }

  res.sendFile(filePath);
});

module.exports = {
  uploadFile,
  getAttachments,
  viewAttachment,
};
