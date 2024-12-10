const express = require("express");

const {
    createCompanyProfile,
    updateCompanyProfile,
    getCompanyProfile,
    getInternship
} = require("../Controllers/companyControllers"); 

const router = express.Router();


router.post("/createProfile", createCompanyProfile);
router.put("/update/:userId", updateCompanyProfile);
router.get("/fetch/:userId", getCompanyProfile);
router.get("/internships", getInternship);


module.exports = router; 
