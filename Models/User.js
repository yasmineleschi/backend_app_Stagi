const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    role: {
      type: String,
      enum: ["Student", "Company"],
      default: "Student",
      required: [true, "Please add the user role"],
    },
    isVerified: { type: Boolean, default: false }, 
    
    verificationToken: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

