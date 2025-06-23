const express = require('express');
const { adminAuth } = require('./middlewares/auth'); // Importing the adminAuth middleware
const connectDB = require('./config/dbconfig');
require("./config/dbconfig"); // Importing the database configuration
const User = require('./models/user'); // Importing the User model

const app = express(); //create an instance of express
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/signup", async(req, res) => {
  try {
    const userObj = {
      firstName : "Subhajit",
      lastName : "Bhattacharya",
      email : "subhajit@bhattacharya.com",
      password : "password123",
      age : 25,
      gender : "M",
    };
    const user = new User(userObj); // Create a new user instance
    await user.save(); // Save the user to the database
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
})

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
