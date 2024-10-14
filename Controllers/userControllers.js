const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
  
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
    const userAvailable2 = await User.findOne({ username });
    if (userAvailable2) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
   
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
  
    // Creating the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created: ${user}`);
    if (user) {
      // Sending the user response
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  });
  



const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "All fields are mandatory!" });
      return;
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

  
      res.status(200).json({
        message: "User found and logged in successfully",
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ error: "Email or password is not valid" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});



const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});




module.exports = { registerUser, loginUser, currentUser };
 