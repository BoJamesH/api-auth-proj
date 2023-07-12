// backend/routes/api/index.js
// Import necessary dependencies
const { User } = require('../../db/models');
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImageRouter = require('./spot-images.js');
const reviewImageRouter = require('./review-images.js');
const reviewRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");
// const { setTokenCookie } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.get('/test', requireAuth, (req, res) => {
  res.json( {message: 'Success'} );
})

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter)

router.use('/reviews', reviewRouter)

router.use('/spot-images', spotImageRouter)

router.use('/review-images', reviewImageRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

// AUTH TESTING:
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
