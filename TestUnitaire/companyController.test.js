const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Updated server export
const User = require("../Models/User");
const Company = require("../Models/Company");
const { connectTestDb, closeTestDb, clearTestDb } = require("./testDb");

let server; // Variable to hold the server instance

describe("Company Routes", () => {
  let userId;
  let companyId;

  beforeAll(async () => {
    await connectTestDb();
    server = app.listen(4000); // Start the server on a specific port for testing
    const user = new User({
      username: "TestUser",
      email: "testuser@example.com",
      password: "password123",
      role: "Company",
    });
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    await closeTestDb();
    await server.close(); // Ensure the server shuts down
  });

  afterEach(async () => {
    await clearTestDb();
  });

  test("should create a company profile successfully", async () => {
    const response = await request(app)
      .post("/api/companies/createProfile")
      .send({
        userId,
        name: "Test Company",
        sector: "Tech",
        address: "123 Test St",
        phoneNumber: "123-456-7890",
        website: "https://testcompany.com",
        description: "A test company",
        yearFounded: "2020-01-01",
        employeeCount: "50",
        internships: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Company profile created successfully");

    const companyProfile = await Company.findOne({ userId });
    expect(companyProfile).not.toBeNull();
  });

  test("should return 404 if company profile is not found", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/companies/update/${nonExistentUserId}`)
      .send({
        name: "Non-Existent Company",
        sector: "Non-Tech",
        address: "Nonexistent St",
        phoneNumber: "000-000-0000",
        website: "http://nonexistent.com",
        description: "A non-existent test company",
        yearFounded: "2025-01-01",
        employeeCount: "0",
        internships: [],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("should return 404 if company profile is not found during get request", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/companies/fetch/${nonExistentUserId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Company profile not found");
  });

  test("should get active internships successfully", async () => {
    const company = new Company({
      userId,
      name: "Test Company",
      address: "123 Test St",
      sector: "Tech",
      phoneNumber: "123-456-7890",
      website: "https://testcompany.com",
      description: "A test company",
      yearFounded: "2020-01-01",
      employeeCount: "50",
      internships: [
        {
          title: "Software Engineer Intern",
          description: "Work with cutting-edge technologies.",
          requirements: ["Python", "IoT"],
          isActive: true,
          startDate: "2024-06-01",
          endDate: "2024-09-01",
          postedDate: "2024-09-01",
        },
        {
          title: "Product Management Intern",
          description: "Assist in product development.",
          requirements: ["Product Management", "Agile"],
          isActive: true,
          startDate: "2024-07-01",
          endDate: "2024-08-01",
          postedDate: "2024-06-01",
        },
      ],
    });

    await company.save();

    const response = await request(app).get("/api/companies/internships");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Software Engineer Intern",
          isActive: true,
        }),
        expect.objectContaining({
          title: "Product Management Intern",
          isActive: true,
        }),
      ])
    );
  });
});
