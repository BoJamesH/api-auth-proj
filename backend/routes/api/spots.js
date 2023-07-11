// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

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


router.get('/:spotId', async (req, res, next) => {
  const spotById = await Spot.findByPk(req.params.spotId);
  res.json(spotById);
})

router.post('/', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  console.log(req.user.id)
  const {address, city, state, country, lat, lng, name, description, price } = req.body;
  if (!address) res.status(400).json('Please provide an address for your property.')
  if (!city) res.status(400).json('Please provide a city for your property.')
  if (!state) res.status(400).json('Please provide a state for your property.')
  if (!state) res.status(400).json('Please provide a state for your property.')
  if (!country) res.status(400).json('Please provide a country for your property.')
  if (!name) res.status(400).json('Please provide a name for your property.')
  if (!description) res.status(400).json('Please provide a description for your property.')
  if (!price) res.status(400).json('Please provide a price for your property.')
  const newSpot = await Spot.create({
    ownerId: userId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  })
  res.json(newSpot)
})

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
