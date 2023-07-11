// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const router = express.Router()

function starAverage(stars) {
    return stars.reduce((a, b) => a + b) / stars.length;
}

function reviewAmount(stars) {
  return stars.length;
}

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
  const thisSpot = req.params.spotId;
  const reviewStars = await Review.findAll({
    where: {
      spotId: thisSpot,
    },
    attributes: ['stars'],
  });
  const starsArray = reviewStars.map(review => review.stars);
  const avgRating = {
    avgStarRating: starAverage(starsArray),
  }
  const numReviews = {
    numReviews: reviewAmount(starsArray)
  }
  const spotById = await Spot.findByPk(thisSpot, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });
  if (!spotById) res.status(404).json('That property could not be found')
  const response = {
    ...spotById.toJSON(),
    ...avgRating,
    ...numReviews,
  };
  res.json(response);
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
  if (!lat) res.status(400).json('Please provide a latitude for your property.')
  if (!lng) res.status(400).json('Please provide a longitude for your property.')
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
    });
    res.json({
      Spots: allSpots});
})

module.exports = router;
