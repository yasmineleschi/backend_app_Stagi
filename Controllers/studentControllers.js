const Institution = require("../Models/Institution"); 
const Student = require("../Models/Student");
const User = require("../Models/User");
const asyncHandler = require("express-async-handler");


const createStudentProfile = asyncHandler(async (req, res) => {
    const { userId, firstName, lastName, specialite, location, phone, bio, education, skills, experience } = req.body;
    try {
      
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

       
        for (let edu of education) {
            if (edu.institution) { 
                let institution = await Institution.findOne({ name: edu.institution });
                
               
                if (institution) {
                    edu.institution = institution._id;
                } else {
                    
                    institution = new Institution({ name: edu.institution });
                    await institution.save();
                    edu.institution = institution._id; 
                }
            }
        }

   
        const studentProfile = new Student({
            userId,
            firstName,
            lastName,
            specialite,
            location,
            phone,
            bio,
            education,
            skills,
            experience,
        });

      
        await studentProfile.save();

     
        res.status(201).json({ message: "Student profile created successfully", studentProfile });
        
    } catch (error) {
      
        res.status(500).json({ message: "An error occurred while creating the student profile", error: error.message });
    }
});


const updateStudentProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, specialite, location, phone, bio, education, skills, experience } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Student") {
        return res.status(403).json({ message: "Access denied: User is not a student" });
    }

    const updatedEducation = [];
    for (const edu of education) {
        let institution = await Institution.findOne({ name: edu.institution });

        if (!institution) {
            institution = new Institution({ name: edu.institution });
            await institution.save();
        }

        updatedEducation.push({
            ...edu,
            institution: institution._id,
        });
    }

   
    const updatedStudentProfile = await Student.findOneAndUpdate(
        { userId: userId },
        {
            firstName,
            lastName,
            specialite,
            location,
            phone,
            bio,
            education: updatedEducation,
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

  
    const studentProfile = await Student.findOne({ userId })
        .populate('education.institution'); 

    if (!studentProfile) {
        return res.status(404).json({ message: "Student profile not found" });
    }


    const formattedEducation = studentProfile.education.map(edu => ({
        ...edu.toObject(),
        institution: edu.institution.name 
    }));

    const response = {
        ...studentProfile.toObject(),
        education: formattedEducation, 
    };

    res.status(200).json({ message: "Student profile retrieved successfully", studentProfile: response });
});


module.exports = {
    createStudentProfile,
    updateStudentProfile,
    getStudentProfile,
};