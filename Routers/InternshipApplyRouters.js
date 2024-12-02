const express = require("express");

const {
    applyForInternship,
    getCompanyApplications,
    updateApplicationStatus,
    getStudentInternships,
} = require("../Controllers/InternshipApplyControllers"); 

const router = express.Router();


router.post("/apply", applyForInternship);
router.get("/company/:companyId", getCompanyApplications);
router.put("/:applicationId", updateApplicationStatus);
router.get("/student/:studentId", getStudentInternships);

module.exports = router; 
