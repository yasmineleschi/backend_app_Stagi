const InternshipApplication = require("../Models/InternshipApplication");
const asyncHandler = require("express-async-handler");

const applyForInternship = asyncHandler(async (req, res) => {
  try {
    const { internshipId, studentId, message, attachmentId, internshipTitle } = req.body;
    const application = new InternshipApplication({
      internshipId,
      internshipTitle,
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
      .populate("attachmentId" , "fileName");

    const filteredApplications = applications.filter(app => app.internshipId); 

    res.status(200).json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications.", error });
  }
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, interviewDate } = req.body;

    const updateData = { status };
    if (status === "Accepted" && interviewDate) {
      updateData.interviewDate = interviewDate;
    }

    const application = await InternshipApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status.", error });
  }
});


const getStudentInternships = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await InternshipApplication.find({ studentId })
      .populate("internshipId", "name")
      .populate("attachmentId", "_id fileName");

    const internships = applications.map((app) => ({
      internship: app.internshipId,
      internshipTitle: app.internshipTitle,
      message: app.message,
      status: app.status,
      appliedAt: app.appliedAt,
      interviewDate: app.interviewDate,
      attachment: app.attachmentId,
    }));

    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch internships.", error });
  }
});


module.exports = { applyForInternship, getCompanyApplications,updateApplicationStatus ,getStudentInternships};