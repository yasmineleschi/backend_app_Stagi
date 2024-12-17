const request = require("supertest");
const app = require("../server");
const User = require("../Models/User");
const { connectTestDb, closeTestDb, clearTestDb } = require("./testDb");

describe("register Routes", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  it("should register a user successfully", async () => {
    const userData = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123!",
      role: "Student",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("email", userData.email);
  

    const createdUser = await User.findById(response.body._id);
    expect(createdUser).not.toBeNull();
    expect(createdUser.email).toBe(userData.email);
   
  });

  it("should return an error if email is already registered", async () => {
    const userData = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123!",
      role: "Student",
    };

    const existingUser = new User(userData);
    await existingUser.save();

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already registered!");

    const users = await User.find({ email: userData.email });
    expect(users.length).toBe(1);
  });

  it("should return an error if username is already taken", async () => {
    const userData = {
      username: "testuser",
      email: "newemail@example.com",
      password: "Password123!",
      role: "Student",
    };

    const existingUser = new User(userData);
    await existingUser.save();

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already registered!");

    const users = await User.find({ username: userData.username });
    expect(users.length).toBe(1);
  });

  it("should return an error if any required field is missing", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({}); // Sending empty data

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are mandatory!");
  });
});
