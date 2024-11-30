const express = require("express");

const {
    applyForInternship,
    getCompanyApplications,
    updateApplicationStatus,
} = require("../Controllers/InternshipApplyControllers"); 

const router = express.Router();


router.post("/apply", applyForInternship);
router.get("/company/:companyId", getCompanyApplications);
router.put("/:applicationId", updateApplicationStatus);

module.exports = router; 
