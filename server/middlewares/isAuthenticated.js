import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Correct way to access cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated!",
      });
    }

    // jwt.verify is synchronous, no need for await
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token!",
      });
    }

    // Attach user ID to request for later use
    req.user = { id: decodedToken.userId };

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

export default isAuthenticated;
