const InternshipApplication = require("../Models/InternshipApplication");
const asyncHandler = require("express-async-handler");

const applyForInternship  = asyncHandler(async (req, res) => {
  try {
    const { internshipId, studentId, message, attachmentId } = req.body;

    const application = new InternshipApplication({
      internshipId,
      studentId,
      message,
      attachmentId,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully.", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application.", error });
  }
});


const getCompanyApplications = asyncHandler(async (req, res) => {
  try {
    const { companyId } = req.params;

    const applications = await InternshipApplication.find()
      .populate({
        path: "internshipId",
        match: { userId: companyId }, 
      })
      .populate("studentId")
      .populate("attachmentId");

    const filteredApplications = applications.filter(app => app.internshipId); // Filter out null internships

    res.status(200).json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications.", error });
  }
});


const updateApplicationStatus  = asyncHandler(async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; 

    const application = await InternshipApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application status updated.", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status.", error });
  }
});

module.exports = { applyForInternship, getCompanyApplications,updateApplicationStatus };