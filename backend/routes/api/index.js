// backend/routes/api/index.js
// Import necessary dependencies
const { User } = require('../../db/models');
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const { setTokenCookie } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

// router.get('/set-token-cookie', async (_req, res) => {
//   // Find the user with the username 'Demo-lition'
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   // Set the token cookie for the user
//   setTokenCookie(res, user);
//   // Return the user JSON in the response
//   return res.json({ user: user });
// });

// router.use(restoreUser);

// // Description: Retrieves and returns the current user from the request object
// router.get('/restore-user', (req, res) => {
//   return res.json(req.user); // Return the user JSON in the response
// });

// // Description: Validates whether the user is authenticated and returns the current user from the request object
// router.get('/require-auth', requireAuth, (req, res) => {
//   return res.json(req.user); // Return the user JSON in the response
// });


module.exports = router;
