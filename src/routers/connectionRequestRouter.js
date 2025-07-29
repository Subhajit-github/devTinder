const express = require('express');
const connectionRequestRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // Importing the userAuth middleware
const ConnectionRequest = require('../models/connectionRequest'); // Importing the ConnectionRequest model
const User = require('../models/user'); // Importing the User model

connectionRequestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; // Get the authenticated user from the request
        const { toUserId, status } = req.params; // Get the userId and status from the request parameters
        console.log("Connection request sent by user:", fromUserId); // Log the user sending the request

        const toUserCheck = await User.findById(toUserId); // Check if the toUserId exists
        if (!toUserCheck) {
            return res.status(404).send("User not found"); // If the user does not exist, send a 404 response
        }

        const sameUserCheck = fromUserId.toString() === toUserId.toString(); // Check if the fromUserId and toUserId are the same
        if (sameUserCheck) {
            return res.status(400).send("You cannot send a connection request to yourself"); // If they are the same, send a 400 response
        }

        const allowedStatuses = ['accepted', 'rejected']; // Define allowed statuses
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status. Status must be one of the following: " + allowedStatuses.join(", "));
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        }); // Check if a connection request already exists
        if (existingRequest) {
            return res.status(400).send("Connection request already exists");
        }

        // Create a new connection request
        const connectionRequest = await ConnectionRequest.create({
            fromUserID,
            toUserID: toUserId,
            status
        });
        console.log("Connection request created:", connectionRequest); // Log the created connection request

        res.sendStatus(200).send("Connection request sent successfully"); // Send a success response
    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(400).send("Error sending connection request: " + error.message); // Send an error response
    }
});

connectionRequestRouter.post("/review/:status/:fromUserId", userAuth, async (req, res) => {
    try {
        const { status, fromUserId } = req.params;
        const toUserId = req.user._id;

        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status. Status must be one of the following: " + allowedStatuses.join(", "));
        }

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId,
            toUserId,
            status: 'interested'
        });
        if (!connectionRequest) {
            return res.status(404).send("Connection request not found");
        }
 
        connectionRequest.status = status;
        await connectionRequest.save();

        res.sendStatus(200).send("Connection request " + status + " successfully");
    } catch (error) {
        console.error("Error reviewing connection request:", error);
        res.status(400).send("Error reviewing connection request: " + error.message);
    }
});

module.exports = connectionRequestRouter; // Exporting the connection request router
// This code defines a router for handling connection request-related operations in an Express application.