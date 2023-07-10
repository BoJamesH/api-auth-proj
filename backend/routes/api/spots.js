// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');

const router = express.Router()

router.get('/current', async (req, res) => {
      // Get the current user's ID from the authenticated user's data
      const userId = req.user.id;
      // Retrieve all spots owned by the current user using the userId
      const spots = await Spot.findAll({
        where: { ownerId: userId },
      });
      // Send the spots as the response
      res.status(200).json({ Spots: spots });
});

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        // include: {
        //     // model: {
        //     //     SpotImage,
        //     //     Review
        //     // }
        // },
    });
    res.json({
      Spots: allSpots});
})

module.exports = router;
