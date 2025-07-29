const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // Importing the userAuth middleware
const ConnectionRequest = require('../models/connectionRequest'); // Importing the ConnectionRequest model

//Get all the interested requests for the authenticated user
userRouter.get('/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get the authenticated user ID
        const interestedRequests = await ConnectionRequest.find({
            toUserID: loggedInUserId,
            status: 'interested'
        }).populate('fromUserID', ['firstName', 'lastName', 'photoURL']); // Populate the fromUserID with user details
        res.status(200).json(interestedRequests);
    } catch (error) {
        console.error("Error fetching interested requests:", error);
        res.status(500).send("Error fetching interested requests: " + error.message);
    }
});


//Get all the connections of the authenticated user
userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get the authenticated user ID
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserID: loggedInUserId, status: 'accepted' },
                { toUserID: loggedInUserId, status: 'accepted' }
            ]
        }).populate('fromUserID', ['firstName', 'lastName', 'photoURL'])
          .populate('toUserID', ['firstName', 'lastName', 'photoURL']); 

        const data = connections.map((row) => {
            if (row.fromUserID._id.toString() === loggedInUserId.toString()) {
                return row.toUserID;
            } else {
                return row.fromUserID;
            }
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching connections:", error);
        res.status(500).send("Error fetching connections: " + error.message);
    }
});

module.exports = userRouter; // Exporting the user router
// This code defines a router for handling user-related requests in an Express application.