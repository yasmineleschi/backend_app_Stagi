const request = require("supertest");
const app = require("../server"); 
const User = require("../Models/User");
const Institution = require("../Models/Institution");
const Student = require("../Models/Student");
const { connectTestDb, closeTestDb, clearTestDb } = require("./testDb");

describe("Student Routes", () => {
  let userId;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    const user = new User({
      username: "StudentUser1",
      email: "Studentuser1@example.com",
      password: "password1234",
      role: "Student",
    });
    await user.save();
    userId = user._id;
  });

  afterEach(async () => {
    await clearTestDb();
  });

  test("should create a student profile successfully", async () => {
    const institution = new Institution({
      name: "University A",
    });
    await institution.save();
  
    const response = await request(app)
      .post("/api/users/profile/createProfile")
      .send({
        userId,  
        firstName: "John",
        lastName: "Doe",
        specialite: "Computer Science",
        location: "City X",
        phone: "123-456-789",
        bio: "Aspiring developer",
        education: [
          {
            degree: "Master",
            institution: institution._id,
            specialite: "Software Engineering",
            startDate: "2015-01-01",
            endDate: "2019-01-01",
          },
        ],
        skills: [
          {
            name: "JavaScript",
            percentage: 90,
          },
        ],
        experience: [
          {
            jobTitle: "Software Engineer",
            company: "Tech Inc",
            startDate: "2020-01-01",
            endDate: "2023-01-01",
            responsibilities: ["Developing software", "Code reviews"],
          },
        ],
      });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Student profile created successfully");
  });
  

  test("should return 404 if user not found", async () => {
    const response = await request(app)
      .post("/api/users/profile/createProfile")
      .send({
        userId: "614c1b1f1b1f1b1f1b1f1b1f",
        firstName: "John",
        lastName: "Doe",
        specialite: "Computer Science",
        location: "City X",
        phone: "123-456-789",
        bio: "Aspiring developer",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("should return 403 if user is not a student", async () => {
    const companyUser = new User({
      username: "CompanyUser",
      email: "Company@example.com",
      password: "Company123",
      role: "Company",
    });
    await companyUser.save();

    const response = await request(app)
      .post("/api/users/profile/createProfile")
      .send({
        userId: companyUser._id,
        firstName: "John",
        lastName: "Doe",
        specialite: "Computer Science",
        location: "City X",
        phone: "123-456-789",
        bio: "Aspiring developer",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied: User is not a student");
  });

  test("should update a student profile successfully", async () => {
    const studentProfile = new Student({
      userId,
      firstName: "John",
      lastName: "Doe",
      specialite: "Computer Science",
      location: "City X",
      phone: "123-456-789",
      bio: "Aspiring developer",
      education: [],
      skills: [],
      experience: [],
    });
    await studentProfile.save();

    const response = await request(app)
      .put(`/api/users/profile/modifierProfile/${userId}`)
      .send({
        firstName: "Malek",
        lastName: "Smith",
        specialite: "Data Science",
        location: "City Y",
        phone: "123-456-789",
        bio: "Aspiring developer",
        education: [],
        skills: [],
        experience: [],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Student profile updated successfully");
    expect(response.body.updatedStudentProfile.firstName).toBe("Malek");
    expect(response.body.updatedStudentProfile.lastName).toBe("Smith");
    expect(response.body.updatedStudentProfile.specialite).toBe("Data Science");
    expect(response.body.updatedStudentProfile.location).toBe("City Y");


  });

  test("should retrieve a student profile successfully", async () => {
    const studentProfile = new Student({
      userId,
      firstName: "John",
      lastName: "Doe",
      specialite: "Computer Science",
      location: "City X",
      phone: "123-456-789",
      bio: "Aspiring developer",
      education: [],
      skills: [],
      experience: [],
    });
    await studentProfile.save();

    const response = await request(app).get(`/api/users/profile/getProfile/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Student profile retrieved successfully");
  
  });
});
