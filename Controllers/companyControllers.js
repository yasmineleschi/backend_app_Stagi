const Company = require("../Models/Company");
const User = require("../Models/User");
const asyncHandler = require("express-async-handler");


const createCompanyProfile = asyncHandler(async (req, res) => {
    const { userId, name, sector, address, phoneNumber, website, description, yearFounded, employeeCount, internships } = req.body;

    try {

    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Company") {
            return res.status(403).json({ message: "Access denied: User is not a company" });
        }

   
        const existingCompanyProfile = await Company.findOne({ userId });
        if (existingCompanyProfile) {
            return res.status(400).json({ message: "Company profile already exists" });
        }

      
        const companyProfile = new Company({
            userId,
            name,
            sector,
            address,
            phoneNumber,
            website,
            description,
            yearFounded,
            employeeCount,
            internships,
        });

        await companyProfile.save();

        res.status(201).json({ message: "Company profile created successfully", companyProfile });
    } catch (error) {
        console.error("Error in createCompanyProfile:", error);
        res.status(500).json({ message: "An error occurred while creating the company profile", error: error.message });
    }
});

const updateCompanyProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, sector, address, phoneNumber, website, description, yearFounded, employeeCount, internships } = req.body;

    try {
       
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Company") {
            return res.status(403).json({ message: "Access denied: User is not a company" });
        }

        const updatedCompanyProfile = await Company.findOneAndUpdate(
            { userId },
            {
                name,
                sector,
                address,
                phoneNumber,
                website,
                description,
                yearFounded,
                employeeCount,
                internships,
            },
            { new: true }
        );

        if (!updatedCompanyProfile) {
            return res.status(404).json({ message: "Company profile not found" });
        }

        res.status(200).json({ message: "Company profile updated successfully", updatedCompanyProfile });
    } catch (error) {
        console.error("Error in updateCompanyProfile:", error);
        res.status(500).json({ message: "An error occurred while updating the company profile", error: error.message });
    }
});

const getInternship = asyncHandler(async (req, res) => {
    try {
        const companies = await Company.find({ "internships.isActive": true })
            .select("name address internships")
            .lean();

        if (!companies.length) {
            return res.status(404).json({ message: "No active internships found" });
        }

        const internships = companies.flatMap((company) =>
            company.internships
                .filter((internship) => internship.isActive) 
                .map((internship) => ({
                    ...internship,
                    companyName: company.name,
                    companyAddress: company.address,
                }))
        );

        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        console.error("Error in getInternship:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});  

const getCompanyProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const companyProfile = await Company.findOne({ userId });

        if (!companyProfile) {
            return res.status(404).json({ message: "Company profile not found" });
        }

        res.status(200).json({ message: "Company profile retrieved successfully", companyProfile });
    } catch (error) {
        console.error("Error in getCompanyProfile:", error);
        res.status(500).json({ message: "An error occurred while retrieving the company profile", error: error.message });
    }
});

const deleteInternship = asyncHandler(async (req, res) => {
    const { companyId, internshipId } = req.params;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const internship = company.internships.id(internshipId);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        internship.remove();
        await company.save();

        res.status(200).json({ message: "Internship deleted successfully" });
    } catch (error) {
        console.error("Error in deleteInternship:", error);
        res.status(500).json({ message: "An error occurred while deleting the internship", error: error.message });
    }
});

module.exports = {
    createCompanyProfile,
    updateCompanyProfile,
    getCompanyProfile,
    deleteInternship,
    getInternship,
};
