import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
// User Registration Controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
        data: null,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
        data: null,
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(`Error while registering: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal server error.Failed to Register.",
      error: error.message,
    });
  }
};

// export const login = async (req, res) => {
//   try {
//     const {  email, password } = req.body;

//     // Check if all required fields are provided
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter Email and Password.",
//         data: null,
//       });
//     }
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect Email or Password",
//         data: null,
//       });
//     }

//     const isPassWordMatch = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!isPassWordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect Email or Password",
//         data: null,
//       });

//     }
//     await generateToken(res,existingUser,`Welcome Back ${existingUser.name}`);
      
      
//   } catch (error) {
//     console.log(`Error While Logging In : ${error}`);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
//We will implement access tokens & refresh tokens for secure authentication
// 🌟 Why Use Refresh Tokens?
// 🔹 Access tokens (JWT) expire quickly for security.
// 🔹 Refresh tokens allow users to get a new access token without logging in again.
// 🔹 This improves security and user experience.
// ✅ Updated Authentication Flow
// 1️⃣ User logs in → Server returns access token (short-lived) + refresh token (long-lived).
// 2️⃣ Access token expires → Client sends refresh token to get a new access token.
// 3️⃣ User logs out → Refresh token is deleted from the database.

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Incorrect Email or Password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Incorrect Email or Password" });
    }

    // Generate access & refresh tokens
    const { accessToken, refreshToken } = generateTokens(existingUser);

    // Save refresh token in the database
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${existingUser.name}`,
      accessToken,
    });

  } catch (error) {
    console.error(`Error While Logging In: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "No refresh token found" });
    }

    // Find the user with the given refresh token
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid refresh token" });
    }

    // Remove refresh token from database
    user.refreshToken = null;
    await user.save();

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error while logging out: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
