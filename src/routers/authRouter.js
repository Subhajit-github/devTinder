const express = require("express");
const authRouter = express.Router();
const { validateRequest } = require('../utils/validation'); // Importing the validation utility
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const User = require('../models/user'); // Importing the User model

authRouter.post("/signup", async(req, res) => {
  try {
    const userObj = req.body; // Get the user object from the request body
    console.log("Received user object:", userObj); // Log the received user object

    //Validate the user object
    validateRequest(userObj); // Validate the user object using the validation utility
    //Encrypt the password if it exists
    const password = userObj.password;
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    
    const user = new User({
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      email: userObj.email,
      password: passwordHash, // Store the hashed password
      age: userObj.age,
      gender: userObj.gender
    }); // Create a new user instance

    await user.save(); // Save the user to the database
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).send("Bad Request");
  }
})

authRouter.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body; // Get email and password from the request body
    console.log("Login attempt with email:", email); // Log the login attempt

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await user.validatePassword(password); // Validate the password using the method defined in the User model
    
    if (isPasswordMatch) {
      // //create a JWT token if the password matches
      console.log("Password match successful for user:", user.email); // Log successful password match
      
      const token = await user.getJWTToken(); // Sign the token with user ID and secret key

      res.cookie("token", token, { httpOnly: true }); // Set the token as a cookie
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login: " + error.message);
  }
});


authRouter.post("/logout", async(req, res) => {
  try {
    res.clearCookie("token"); // Clear the token cookie
    return res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Error during logout: " + error.message);
  }
});

module.exports = authRouter; // Export the auth router for use in other files
// This code defines an authentication router for user signup and login in an Express application.