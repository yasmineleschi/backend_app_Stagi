const request = require("supertest");
const app = require("../server");
const { connectTestDb, closeTestDb, clearTestDb } = require("./testDb");
const InternshipApplication = require("../Models/InternshipApplication");
const Company = require("../Models/Company");
const mongoose = require("mongoose");

describe("InternshipApplication Controller", () => {
  
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  describe("POST /api/internshipApply/apply", () => {
    it("should apply for an internship successfully", async () => {
      const applicationData = {
        internshipId: "60d5f1e5f43f1c001f97cd60",  // sample company ID
        studentId: "60d5f1e5f43f1c001f97cd61",  // sample student ID
        message: "I'm interested in this internship.",
        internshipTitle: "Software Development Internship",
      };

      const response = await request(app)
        .post("/api/internshipApply/apply")
        .send(applicationData)
        .expect(201);

      expect(response.body.message).toBe("Application submitted successfully.");
      expect(response.body.application).toHaveProperty("internshipId", applicationData.internshipId);
      expect(response.body.application).toHaveProperty("studentId" , applicationData.studentId);
      expect(response.body.application).toHaveProperty("message",applicationData.message);
      expect(response.body.application).toHaveProperty("internshipTitle" , applicationData.internshipTitle);
    });

    it("should return an error if application fails", async () => {
      const applicationData = {}; // Invalid data to trigger error

      const response = await request(app)
        .post("/api/internshipApply/apply")
        .send(applicationData)
        .expect(500);

      expect(response.body.message).toBe("Failed to submit application.");

    });
  });


  describe("PUT /api/internshipApply/:applicationId", () => {
    it("should update the application status", async () => {
      // Setup mock application
      const application = new InternshipApplication({
        internshipId: "60d5f1e5f43f1c001f97cd60", 
        studentId: "60d5f1e5f43f1c001f97cd61", 
        message: "I'm interested in this internship.",
        internshipTitle: "Software Development Internship",
      });
      await application.save();

      const response = await request(app)
        .put(`/api/internshipApply/${application._id}`)
        .send({ status: "Accepted", interviewDate: "2024-12-20T10:00:00.000Z" })
        .expect(200);

      expect(response.body.message).toBe("Application status updated.");
      expect(response.body.application.status).toBe("Accepted");
      expect(response.body.application.interviewDate).toBe("2024-12-20T10:00:00.000Z");
    });

    it("should return an error if application status update fails", async () => {
      const response = await request(app)
        .put("/api/internshipApply/invalidApplicationId")
        .expect(500);

      expect(response.body.message).toBe("Failed to update status.");
    });
  });

  describe("GET /api/internshipApply/student/:studentId", () => {
    it("should fetch all internships applied by a student", async () => {
      // Setup mock application
      const application = new InternshipApplication({
        internshipId: "60d5f1e5f43f1c001f97cd60", 
        studentId: "60d5f1e5f43f1c001f97cd61", 
        message: "I'm interested in this internship.",
        internshipTitle: "Software Development Internship",
      });
      await application.save();

      const response = await request(app)
        .get("/api/internshipApply/student/60d5f1e5f43f1c001f97cd61")  // mock student ID
        .expect(200);

      expect(response.body).toHaveLength(1);  // Expecting one application
      expect(response.body[0]).toHaveProperty("internship");
      expect(response.body[0]).toHaveProperty("status", "Pending");
    });

    it("should return an empty array if no internships", async () => {
      const response = await request(app)
        .get("/api/internshipApply/student/60d5f1e5f43f1c001f97cd61")  // mock student ID
        .expect(200);

      expect(response.body).toHaveLength(0);  // No applications
    });

    it("should return an error if fetching student internships fails", async () => {
      const response = await request(app)
        .get("/api/internshipApply/student/invalidStudentId")
        .expect(500);

      expect(response.body.message).toBe("Failed to fetch internships.");
    });
  });



});
