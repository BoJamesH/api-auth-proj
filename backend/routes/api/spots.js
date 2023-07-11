// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')

const router = express.Router()

function starAverage(stars) {
    return stars.reduce((a, b) => a + b) / stars.length;
}

// router.get('/current', async (req, res) => {
//   const userId = req.user.id;
//   const spots = await Spot.findAll({
//     where: { ownerId: userId },
//   });

//   const reviewStars = [];
//   await Promise.all(
//     spots.map(async (spot) => {
//       const reviews = await Review.findAll({
//         where: { spotId: spot.id },
//         attributes: ['stars'],
//       });
//       reviewStars.push(...reviews);
//     })
//   );
//   const starsArray = reviewStars.map(review => review.stars);
//   const avgRating = {
//     avgStarRating: starAverage(starsArray),
//   }
//   // Get the current user's ID from the authenticated user's data
//   // Retrieve all spots owned by the current user using the userId
//   // Send the spots as the response
//   const response = {
//     ...spots.toJSON(),
//     ...avgRating,
//   };
//   res.json(response);
// });

router.get('/current', async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: { ownerId: userId },
  });

  const reviewStars = [];
  await Promise.all(
    spots.map(async (spot) => {
      const reviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: ['stars'],
      });
      reviewStars.push(...reviews);
    })
  );
  const starsArray = reviewStars.map(review => review.stars);
  const avgRating = starAverage(starsArray);

  const response = {
    Spots: await Promise.all(spots.map(async (spot) => {
      const spotImages = await SpotImage.findAll({
        where: {
          spotId: spot.id,
          preview: true,
        },
        limit: 1,
      });

      const imageUrl = spotImages.length > 0 ? spotImages[0].url : null;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: avgRating,
        previewImage: imageUrl,
      };
    }))
  };
  res.json(response);
});


router.get('/:spotId', async (req, res, next) => {
  const thisSpot = req.params.spotId;
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
  if (!spotById) {
    const error = new Error();
    error.message = `That property couldn't be found`,
    error.status = 404;
    throw error;
  }
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
    numReviews: starsArray.length
  }
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
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
        limit: 1,
      },
    ],
  });

  const spotIds = allSpots.map(spot => spot.id);

  const reviewStars = await Review.findAll({
    where: { spotId: spotIds },
    attributes: ['spotId', 'stars'],
  });

  for (const review of reviewStars) {
    if (!spotAverageRatings[review.spotId]) {
      spotAverageRatings[review.spotId] = { totalStars: 0, count: 0 };
    }
    spotAverageRatings[review.spotId].totalStars += review.stars;
    spotAverageRatings[review.spotId].count++;
  }

  const response = {
    Spots: allSpots.map(spot => {
      const spotId = spot.id;
      const avgRating = spotAverageRatings[spotId] ? spotAverageRatings[spotId].totalStars / spotAverageRatings[spotId].count : null;
      const imageUrl = spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: avgRating,
        previewImage: imageUrl,
      };
    }),
  };
  res.json(response);
});

module.exports = router;
