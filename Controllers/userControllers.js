const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");


const registerUser = asyncHandler(async (req, res) => {

  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
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
    throw new Error("Username already taken!");
  }

 
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);


  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  console.log(`User created: ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      { user: { id: user.id, email: user.email, username: user.username, role: user.role } },  // Include role in the JWT payload
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      userId: user.id,
      role: user.role,  // Return role as part of the response
      user: { id: user.id, username: user.username, email: user.email },
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});



const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
