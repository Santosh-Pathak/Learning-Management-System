// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.SECRET_KEY; // Secret key for JWT

// export const generateToken = (res, user, message) => {
//   if (!SECRET_KEY) {
//     throw new Error("SECRET_KEY is not defined in environment variables.");
//   }

//   // Generate a JWT token with userId and an expiration of 1 day
//   const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });

//   // Set the token in an HTTP-only cookie for secure storage
//   res
//     .status(200)
//     .cookie("token", token, {
//       httpOnly: true, // Prevents client-side JS access for security
//       secure: process.env.NODE_ENV === "production", // Ensures HTTPS usage in production
//       sameSite: "Strict", // Prevents CSRF attacks
//       maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//     })
//     .json({
//       success: true,
//       message,
//       token,
//     });
// };

import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;  // Secret key for access token
const REFRESH_SECRET = process.env.REFRESH_SECRET; // Secret key for refresh token

export const generateTokens = (user) => {
  if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("Missing secret keys in environment variables.");
  }

  // Create access token (short-lived)
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role }, // Include user role
    ACCESS_SECRET,
    { expiresIn: "1d" }  // Expires in 1 day
  );

  // Create refresh token (long-lived)
  const refreshToken = jwt.sign(
    { userId: user._id },
    REFRESH_SECRET,
    { expiresIn: "7d" } // Expires in 7 days
  );

  return { accessToken, refreshToken };
};

export default generateTokens;