const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth'); // Importing the userAuth middleware
const ConnectionRequest = require('../models/connectionRequest'); // Importing the ConnectionRequest model
const User = require('../models/user'); // Importing the User model

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

//Create the API for user feed
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get the authenticated user ID
        // LoggedIn user should not see profile of himself/herself, his accepted and ignored connection requests

        //Find users who are connection of logged in user or accepted/rejected connection requests of logged in user or
        //Logged In user accepted or rejected connection requests of other users
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserID: loggedInUserId, status: { $in: ['accepted', 'rejected'] } },
                { toUserID: loggedInUserId, status: { $in: ['accepted', 'rejected'] } }
            ]
        }).populate('fromUserID', ['firstName', 'lastName', 'photoURL'])
          .populate('toUserID', ['firstName', 'lastName', 'photoURL']);

        //Create set of user IDs to hide from logged in user's feed
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserID._id.toString());
            hideUserFromFeed.add(req.toUserID._id.toString());
        });

        // Find all users except the logged in user and those in the hideUserFromFeed set
        const userFeed = await User.find({
            _id: { $ne: loggedInUserId, $nin: Array.from(hideUserFromFeed) }
        }, ['firstName', 'lastName', 'photoURL', 'email', 'age']);

        //Implement Pagination (optional)
        const page = parseInt(req.query.page) || 1; // Get the page
        const limit = parseInt(req.query.limit) || 10; // Get the limit
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        const paginatedFeed = userFeed.slice(skip, skip + limit); // Get the paginated feed
        res.status(200).json(paginatedFeed);
    } catch (error) {
        console.error("Error fetching user feed:", error);
        res.status(500).send("Error fetching user feed: " + error.message);
    }
});

module.exports = userRouter; // Exporting the user router
// This code defines a router for handling user-related requests in an Express application.