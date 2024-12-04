const mongoose = require("mongoose");

const internshipApplicationSchema = mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", 
      required: true,
    },
    internshipTitle: {
      type: String, 
     
    },
    message: {
      type: String,
      required: true,
    },
    attachmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment", 
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"], 
      default: "Pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    interviewDate: { 
      type: Date
     },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InternshipApplication", internshipApplicationSchema);
