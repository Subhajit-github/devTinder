const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const validator = require('validator'); // Importing validator for input validation
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token handling

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
});

userSchema.methods.getJWTToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "secretKey", { expiresIn: "1h" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isMatch = await bcrypt.compare(passwordInputByUser, user.password);
    return isMatch;
}

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema and model for a User in a MongoDB database.