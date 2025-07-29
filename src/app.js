const express = require('express');
const connectDB = require('./config/dbconfig');
const cookieParser = require('cookie-parser');
require("./config/dbconfig"); // Importing the database configuration
const profileRouter = require('./routers/profileRouter'); // Importing the profile router
const authRouter = require('./routers/authRouter'); // Importing the auth router
const connectionRequestRouter = require('./routers/connectionRequestRouter'); // Importing the connection request router
const userRouter = require('./routers/userRouter'); // Importing the user request router

const app = express(); //create an instance of express
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/api/auth', authRouter); // Mounting the auth router
app.use('/api/profile', profileRouter); // Mounting the profile router
app.use('/api/request', connectionRequestRouter); // Mounting the connection request router
app.use('/api/user', userRouter); // Mounting the user router

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
