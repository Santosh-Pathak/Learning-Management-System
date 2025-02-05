import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required for every user
    },
    email: {
      type: String,
      required: true, // Email is required for authentication
      unique: true, // Ensures no duplicate emails exist in the database
      lowercase: true, // Stores email in lowercase format
      trim: true, // Removes leading/trailing spaces
    },
    password: {
      type: String,
      required: true, // Password is required for authentication
    },
    role: {
      type: String,
      enum: ["instructor", "student"], // Only allows "instructor" or "student" as valid roles
      default: "student", // Default role is "student"
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId, // References Course model
        ref: "Course", // Establishes relationship with Course schema
      },
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Creating a User model from the schema
const User = mongoose.model("User", userSchema);

export default User; // Exporting the model for use in other files
