// backend/routes/api/users.js
// Import the express package
const express = require('express');
// Import the Op object from sequelize for querying
const { Op } = require('sequelize');
// Import the bcryptjs package for password hashing
const bcrypt = require('bcryptjs');
// Import authentication utility functions from the auth module
const { setCookieToken, restoreUser, setTokenCookie } = require('../../utils/auth');
// Import the User model from the db/models module
const { User } = require('../../db/models');
// Import the check function from express-validator for request body validation
const { check } = require('express-validator');
// Import the handleValidationErrors middleware from the utils/validation module
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

// Array of validation checks for login
const validateLogin = [
    // Validation check for the 'credential' field
    check('credential')
      .exists({ checkFalsy: true }) // Check if the field exists and is not falsy
      .notEmpty() // Check if the field is not empty
      .withMessage('Please provide a valid email or username.'), // Set a validation error message if the checks fail
    // Validation check for the 'password' field
    check('password')
      .exists({ checkFalsy: true }) // Check if the field exists and is not falsy
      .withMessage('Please provide a password.'), // Set a validation error message if the check fails
    handleValidationErrors // Custom middleware for handling validation errors
];


// Log in auth process:
router.post('/', validateLogin, async (req, res, next) => {
    // Extract the credential and password from the request body
    const { credential, password } = req.body;
    // Find a user that matches the provided credential (username or email)
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        }
      }
    });
    // Check if a user was found or if the provided password is invalid
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      // Create an error object for failed login
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err); // Pass the error to the next middleware
    }
    // Create a safeUser object containing selected user properties
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    // Set the token cookie for the safeUser
    await setTokenCookie(res, safeUser);
    // Return the safeUser JSON in the response
    return res.status(201).json({
      user: safeUser,
    });
});

// Log out process:
router.delete('/', (_req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    // Return a JSON response indicating successful logout
    return res.json({ message: 'Successfully logged out' });
});

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
      // If a user exists in the session, create a safeUser object containing selected user properties
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      // Return the safeUser JSON in the response
      return res.json({
        user: safeUser
      });
    } else {
      // If no user exists in the session, return null in the user JSON response
      return res.json({ user: null });
    }
  });

module.exports = router;
