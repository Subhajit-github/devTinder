const express = require('express');
const { userAuth } = require('./middlewares/auth'); // Importing the adminAuth middleware
const connectDB = require('./config/dbconfig');
require("./config/dbconfig"); // Importing the database configuration
const User = require('./models/user'); // Importing the User model
const { validateRequest } = require('./utils/validation'); // Importing the validation utility
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token handling

const app = express(); //create an instance of express
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post("/signup", async(req, res) => {
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

app.post("/login", async(req, res) => {
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
    
    if (!isPasswordMatch) {
      // //create a JWT token if the password matches
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

app.get("/profile", userAuth, async(req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    console.log("User profile accessed:", user); // Log the user profile access
    res.status(200).send(JSON.stringify(user)); // Send the user profile as a response
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Error fetching user profile: " + error.message);
  }
});

async function startServer() {
  try {
    await connectDB(); // Connect to the database
    console.log("Database connected successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

startServer(); // Call the function to start the server
