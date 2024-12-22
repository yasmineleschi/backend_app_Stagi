require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // Import your User model
const { loginUser } = require("../Controllers/userControllers");

describe("loginUser function - Real Database Test", () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.CONNECTION_STRING);

    // Clear the database before populating it
    await User.deleteMany();

    // Add the test user
    const hashedPassword = await bcrypt.hash("123456789", 10);
    await User.create({
      email: "sirin@gmail.com",
      password: hashedPassword,
      username: "sirin",
      role: "Student",
    });
  });

  afterAll(async () => {
    // Clean up and close the database connection
    await mongoose.connection.close();
  });

  it("should log in an existing user with correct credentials", async () => {
    const req = {
      body: {
        email: "sirin@gmail.com",
        password: "123456789",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User logged in successfully",
        accessToken: expect.any(String),
        userId: expect.any(String),
        role: "Student",
        user: expect.objectContaining({
          email: "sirin@gmail.com",
        }),
      })
    );
  });

  it("should return 401 for invalid credentials", async () => {
    const req = {
      body: {
        email: "sirin@gmail.com",
        password: "wrongpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid credentials",
    });
  });
});
