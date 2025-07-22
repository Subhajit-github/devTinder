const validator = require('validator');

const validateRequest = (req) => {
    console.log("Validating request body:", req); // Log the request body for debugging
    
    const {firstName, lastName, email, password} = req;

    if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
    } else if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    } else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
    }
}

const validateProfileUpdate = (updateData) => {
    console.log("Validating profile update request body:", updateData); // Log the request body for debugging
    try {
        const allowedFields = ['firstName', 'lastName', 'email', 'age', 'gender', 'photoURL']; // Define allowed fields for profile update
        Object.keys(updateData).forEach((field) => {
            if (!allowedFields.includes(field)) {
                throw new Error(`Field '${field}' is not allowed`);
            }
        });
    } catch (error) {
        throw new Error('Invalid profile update data');
        
    }
}

module.exports = {
    validateRequest,
    validateProfileUpdate,
};