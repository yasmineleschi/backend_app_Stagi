const Student = require("../Models/Student"); 
const User = require("../Models/User"); 
const asyncHandler = require("express-async-handler");


const createStudentProfile = asyncHandler(async (req, res) => {
    const { userId, firstName, lastName, specialite ,location, phone, bio, education, skills, experience } = req.body;

    
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    
    if (user.role !== "Student") {
        return res.status(403).json({ message: "Access denied: User is not a student" });
    }

  
    const existingStudentProfile = await Student.findOne({ userId });
    if (existingStudentProfile) {
        return res.status(400).json({ message: "Student profile already exists" });
    }


    const studentProfile = new Student({
        userId,
        firstName,
        lastName,
        specialite ,
        location,
        phone,
        bio,
        education,
        skills,
        experience,
    });

    await studentProfile.save();
    res.status(201).json({ message: "Student profile created successfully", studentProfile });
});


const updateStudentProfile = asyncHandler(async (req, res) => {
    const { userId, firstName, lastName, specialite ,location, phone, bio, education, skills, experience } = req.body;

   
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Student") {
        return res.status(403).json({ message: "Access denied: User is not a student" });
    }


    const updatedStudentProfile = await Student.findOneAndUpdate(
        { userId },
        {
            firstName,
            lastName,
            specialite,
            location,
            phone,
            bio,
            education,
            skills,
            experience,
        },
        { new: true }
    );

    if (!updatedStudentProfile) {
        return res.status(404).json({ message: "Student profile not found" });
    }

    res.status(200).json({ message: "Student profile updated successfully", updatedStudentProfile });
});

const getStudentProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

   
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

   
    if (user.role !== "Student") {
        return res.status(403).json({ message: "Access denied: User is not a student" });
    }

    
    const studentProfile = await Student.findOne({ userId });
    if (!studentProfile) {
        return res.status(404).json({ message: "Student profile not found" });
    }

    res.status(200).json({ message: "Student profile retrieved successfully", studentProfile });
});

module.exports = {
    createStudentProfile,
    updateStudentProfile,
    getStudentProfile,
};