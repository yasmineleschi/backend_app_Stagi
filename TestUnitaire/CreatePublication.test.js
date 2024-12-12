const request = require("supertest");
const app = require("../server"); // Import the app from server.js
const mongoose = require("mongoose");
const Publication = require("../Models/Publication");

describe("POST /api/publications", () => {
  let token; // This will store the token for authentication

  // Before all tests, we'll set the provided JWT token for authorization
  beforeAll(() => {
    // Use the provided JWT token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyYTBjOGUwMzg3NDk0YTFkYzhiY2IwIiwiZW1haWwiOiJzaXJpbkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InNpcmluIiwicm9sZSI6IlN0dWRlbnQifSwiaWF0IjoxNzMzODI5NTU3LCJleHAiOjE3MzM4MzA0NTd9.83Juxkd5GuqhQLaE0aNKRNsRJQG1_4PL569Y6Jysfcs"; // Use the provided token
  });

  // Clean up after each test
  afterEach(async () => {
    // Clear the database to ensure no data is carried over to other tests
    await Publication.deleteMany();
  });

  it("should create a publication successfully", async () => {
    const mockFile = { path: "path/to/image.jpg" }; // Mock file path for image
    const mockPdf = { path: "path/to/file.pdf" }; // Mock file path for pdf

    const response = await request(app)
      .post("/api/publications")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", mockFile.path) // Attach the image file
      .attach("pdf", mockPdf.path) // Attach the PDF file
      .field("title", "Test Title")
      .field("content", "Test content for the publication");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Title");
    expect(response.body).toHaveProperty("content", "Test content for the publication");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("pdf");
  });

  it("should return 400 if title or content is missing", async () => {
    const response = await request(app)
      .post("/api/publications")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "") // Missing title
      .field("content", "Test content with missing title");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title and content are required!");
  });

  it("should handle file uploads correctly", async () => {
    const mockFile = { path: "path/to/image.jpg" }; // Mock file path for image
    const mockPdf = { path: "path/to/file.pdf" }; // Mock file path for pdf

    const response = await request(app)
      .post("/api/publications")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", mockFile.path) // Attach the image file
      .attach("pdf", mockPdf.path) // Attach the PDF file
      .field("title", "Test Title with PDF")
      .field("content", "Test content with PDF");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Title with PDF");
    expect(response.body).toHaveProperty("content", "Test content with PDF");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("pdf");
  });

  it("should return 500 if there's an error creating a publication", async () => {
    // Simulate a failure in the creation process (you can mock the Publication.create function to fail)
    jest.spyOn(Publication, "create").mockImplementationOnce(() => {
      throw new Error("Failed to create publication");
    });

    const response = await request(app)
      .post("/api/publications")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test Title")
      .field("content", "Test content with error");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to create publication");
  });
});
