const express = require("express");
const {
    createStudentProfile,
    updateStudentProfile,
    getStudentProfile,
} = require("../Controllers/studentControllers"); 

const router = express.Router();


router.post("/createProfile", createStudentProfile);
router.put("/modifierProfile/:userId", updateStudentProfile);
router.get("/getProfile/:userId", getStudentProfile);


module.exports = router; 
