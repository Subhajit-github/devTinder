const express = require('express');
const connectionRequestRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // Importing the userAuth middleware

connectionRequestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user; // Get the authenticated user from the request
        console.log("Connection request sent by user:", user); // Log the user sending the request

        res.sendStatus(200).send("Connection request sent successfully"); // Send a success response
    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(500).send("Error sending connection request: " + error.message); // Send an error response
    }
});

module.exports = connectionRequestRouter; // Exporting the connection request router
// This code defines a router for handling connection request-related operations in an Express application.