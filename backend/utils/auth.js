// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    // Create the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser }, // Payload containing user data
        secret, // Secret key for signing the token
        { expiresIn: parseInt(expiresIn) } // Expiration time for the token
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie 
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // Set the maximum age of the cookie in milliseconds
        httpOnly: true, // The cookie cannot be accessed via client-side JavaScript
        secure: isProduction, // The cookie is only sent over HTTPS in production
        sameSite: isProduction && "Lax", // Restrict cookie to same-site requests in production
    });

    return token; // Return the generated token
}

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null; // Initialize req.user as null

    // Verify the token using jwt.verify
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next(); // Proceed to the next middleware if there's an error
      }
      try {
        const { id } = jwtPayload.data; // Extract user ID from the JWT payload
        // Find the user by ID and include specific attributes in the result
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token'); // Clear the token cookie if an error occurs
        return next(); // Proceed to the next middleware
      }

      if (!req.user) res.clearCookie('token'); // Clear the token cookie if the user is not found

      return next(); // Proceed to the next middleware
    });
};

const requireAuth = function (req, _res, next) {
    if (req.user) return next(); // If req.user exists, authentication is already established, so proceed to the next middleware.

    // If req.user does not exist, authentication is required.
    const err = new Error('Authentication required'); // Create a new Error object with a descriptive message.
    err.title = 'Authentication required'; // Set the error title to 'Authentication required'.
    err.errors = { message: 'Authentication required' }; // Attach an errors object with a message property to the error.
    err.status = 401; // Set the HTTP status code to 401 (Unauthorized).

    return next(err); // Pass the error to the next middleware.
}

module.exports = { setTokenCookie, restoreUser, requireAuth };
