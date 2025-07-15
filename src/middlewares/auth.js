const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token handling
const User = require('../models/user'); // Importing the User model

const userAuth = async (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies
  try {
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedObj = jwt.verify(token, "secretKey");
    // Find the user by ID from the decoded token
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
    console.error("Authentication error:", err);
  }
};

module.exports = { userAuth }; // Export the middleware for use in other files
// This middleware checks if the user is authenticated by verifying the JWT token.