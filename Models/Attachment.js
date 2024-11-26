const mongoose = require("mongoose");

const attachmentSchema = mongoose.Schema(
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", 
        required: true
      },
      fileName: {
        type: String,
    
      },
      filePath: {
        type: String,
  
      },
      fileType: {
        type: String,

      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  );
  
  module.exports = mongoose.model("Attachment", attachmentSchema);
  