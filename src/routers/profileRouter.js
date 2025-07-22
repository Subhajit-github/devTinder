const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // Importing the adminAuth middleware
const User = require('../models/user'); // Importing the User model
const { validateProfileUpdate } = require('../utils/validation'); // Importing the validation utility


profileRouter.get("/view", userAuth, async(req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    console.log("User profile accessed:", user); // Log the user profile access
    res.status(200).send(JSON.stringify(user)); // Send the user profile as a response
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Error fetching user profile: " + error.message);
  }
});

profileRouter.patch("/edit", userAuth, async(req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    const updateData = req.body; // Get the update data from the request body
    console.log("Updating user profile with data:", updateData); // Log the update data
    // Validate the update data using the validation utility
    const { validateProfileUpdate } = require('../utils/validation');
    validateProfileUpdate(updateData); // Validate the update data

    // Update the user profile with the provided data
    Object.assign(user, updateData);
    await user.save(); // Save the updated user profile to the database

    res.status(200).send("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Error updating user profile: " + error.message);
  }
});

profileRouter.patch("/updatePassword", userAuth, async(req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    const { currentPassword, newPassword } = req.body; // Get the current and new passwords from the request body

    // Validate the current password
    await user.validatePassword(currentPassword);

    // Hash the new password and update it
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await user.save();

    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Error updating password: " + error.message);
  }
});

module.exports = profileRouter; // Exporting the profile router
// This code defines a router for handling user profile requests in an Express application.