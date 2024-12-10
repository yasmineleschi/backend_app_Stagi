const loginUser = require("../Controllers/userControllers").loginUser; // Correct relative path
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
////////////////   npx jest Unit_Tests/loginUser.test.js ///////////////////
// Mocking dependencies
jest.mock("../Models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("loginUser function", () => {
  it("should log in a user with valid credentials", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      username: "testuser",
      password: "hashedpassword",
      role: "Student",
    };

    // Mocking User.findOne to return a user
    User.findOne.mockResolvedValue(mockUser);

    // Mocking bcrypt.compare to return true
    bcrypt.compare.mockResolvedValue(true);

    // Mocking jwt.sign to return a token
    jwt.sign.mockReturnValue("mockToken");

    const req = {
      body: { email: "test@example.com", password: "password" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedpassword");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User logged in successfully",
        accessToken: "mockToken",
        userId: "123",
        role: "Student",
        user: expect.objectContaining({
          id: "123",
          username: "testuser",
          email: "test@example.com",
        }),
      })
    );
  });

  it("should return 401 for invalid credentials", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: { email: "wrong@example.com", password: "password" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "wrong@example.com" });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});
