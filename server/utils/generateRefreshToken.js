export const refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
      }
  
      const existingUser = await User.findOne({ refreshToken });
      if (!existingUser) {
        return res.status(403).json({ success: false, message: "Forbidden: Invalid refresh token" });
      }
  
      // Verify refresh token
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }
  
        // Generate a new access token
        const accessToken = jwt.sign({ userId: decoded.userId, role: existingUser.role }, process.env.ACCESS_SECRET, {
          expiresIn: "15m",
        });
  
        return res.status(200).json({ success: true, accessToken });
      });
    } catch (error) {
      console.error(`Error while refreshing token: ${error.message}`);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  