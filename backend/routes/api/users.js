// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res) => {
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
