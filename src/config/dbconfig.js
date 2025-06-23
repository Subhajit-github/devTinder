const mongoose = require('mongoose');
const dbconfig = "mongodb+srv://subhajitbhattacharya08:5elq5hgbFk7ut26Z@namastenodejs.nihm1gk.mongodb.net/devTinder";


const connectDB = async () => {
        await mongoose.connect(dbconfig);
};

module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose.
// It exports a function `connectDB` that attempts to connect to the database using the provided connection string.
// If the connection is successful, it logs a success message; if it fails, it logs the error.
