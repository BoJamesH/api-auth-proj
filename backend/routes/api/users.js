// backend/routes/api/users.js
// Import the express package
const express = require('express');
// Import the bcryptjs package for password hashing
const bcrypt = require('bcryptjs');
// Import authentication utility functions from the auth module
const { setTokenCookie, requireAuth } = require('../../utils/auth');
// Import the User model from the db/models module
const { User } = require('../../db/models');
// Import the check function from express-validator for request body validation
const { check } = require('express-validator');
// Import the handleValidationErrors middleware from the utils/validation module
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

// Array of validation checks for signup
const validateSignup = [
    // Validation check for the 'email' field
    check('email')
      .exists({ checkFalsy: true }) // Check if the field exists and is not falsy
      .isEmail() // Check if the field is a valid email address
      .withMessage('Please provide a valid email.'), // Set a validation error message if the checks fail
    // Validation check for the 'username' field
    check('username')
      .exists({ checkFalsy: true }) // Check if the field exists and is not falsy
      .isLength({ min: 4 }) // Check if the field has a minimum length of 4 characters
      .withMessage('Please provide a username with at least 4 characters.'), // Set a validation error message if the checks fail
    // Additional validation check for the 'username' field
    check('username')
      .not()
      .isEmail() // Check if the field is not an email address
      .withMessage('Username cannot be an email.'), // Set a validation error message if the check fails
    // Validation check for the 'password' field
    check('password')
      .exists({ checkFalsy: true }) // Check if the field exists and is not falsy
      .isLength({ min: 6 }) // Check if the field has a minimum length of 6 characters
      .withMessage('Password must be 6 characters or more.'), // Set a validation error message if the checks fail
    handleValidationErrors // Custom middleware for handling validation errors
  ];


router.post('/', validateSignup, async (req, res) => {
    // Extract email, password, and username from the request body
    const { email, password, username } = req.body;
    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password);
    // Create a new user with the provided email, username, and hashed password
    const user = await User.create({ email, username, hashedPassword });
    // Create a safeUser object containing selected user properties
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    // Set the token cookie for the safeUser
    await setTokenCookie(res, safeUser);
    // Return the safeUser JSON in the response
    return res.json({
      user: safeUser
    });
});

module.exports = router;
