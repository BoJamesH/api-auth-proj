// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const {setCookieToken, restoreUser, setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Log in auth process:
router.post('/', async (req, res, next) => {
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
      email: user.email,
      username: user.username,
    };

    // Set the token cookie for the safeUser
    await setTokenCookie(res, safeUser);

    // Return the safeUser JSON in the response
    return res.json({
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

module.exports = router;
