// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');

const router = express.Router()

router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        // include: {
        //     // model: {
        //     //     SpotImage,
        //     //     Review
        //     // }
        // },
    });
    res.json(allSpots);
})

module.exports = router;
