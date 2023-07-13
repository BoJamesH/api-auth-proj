// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js')
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../utils/validations.js')

const router = express.Router()

function starAverage(stars) {
    return stars.reduce((a, b) => a + b) / stars.length;
}

router.get('/current', requireAuth, async (req, res) => {
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


router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;
  const spotInQuestion = await Spot.findByPk(spotId)
  if (!spotInQuestion) return res.status(404).json({ message: "That property could not be found" })
  const reviewsBySpotId = await Review.findAll({
      where: { spotId },
      include: [
          {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: ReviewImage,
            attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] },
          },
      ],
    });
    res.json({ 'Reviews': reviewsBySpotId })
});


router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { review, stars } = req.body;
  const errors = {};
  if (!review) errors.review = 'Review text is required.';
  if (!stars) errors.starsRequired = 'Star rating is required.';
  if (stars) {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(404).json({
      message: 'Bad Request',
      errors: errors,
  });
  }

  const existingReview = await Review.findOne({
    where: {
      userId: userId,
      spotId: spotId,
    },
  });
  if (existingReview) return res.status(500).json({ message: "User already has a review for this property" })

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,
  })
  res.json(newReview);
});


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { url, preview } = req.body;
  const addImageSpot = await Spot.findByPk(spotId);
  if (!addImageSpot) return res.status(404).json({ message: "That property could not be found" })
  if (addImageSpot.ownerId !== userId) {
    const err = new Error();
    err.status = 403;
    err.message = 'You are forbidden from adding pictures to properties that do not belong to you.'
    throw err;
  };
  if (!url) return res.status(404).json({ message: "Must provide photo url to add photo" })
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  })
  const response = { "id": newImage.id, "url": url, "preview": preview }
  res.json(response)
})


router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spotInQuestion = await Spot.findByPk(spotId)
  if (!spotInQuestion) return res.status(404).json({ message: "That property could not be found" })
  if (spotInQuestion.ownerId === userId) {
    const ownerBookingsBySpotId = await Booking.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
        ],
      });
    res.json({ 'Bookings': ownerBookingsBySpotId })
  }
  const bookingsBySpotId = await Booking.findAll({
    where: { spotId },
    attributes: ['spotId', 'startDate', 'endDate']
  })
  res.json({ 'Bookings': bookingsBySpotId})
});


router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  // console.log(spotId)
  const userId = req.user.id;
  const { startDate, endDate } = req.body;
  const errors = {};
  if (!startDate) errors.startDate = 'Start date is required.';
  if (!endDate) errors.endDate = 'End date is required.';
  if (Object.keys(errors).length > 0) {
    return res.status(404).json({
      message: 'Bad Request',
      errors: errors,
    });
  }
  if (new Date(endDate) < new Date(startDate)) {
    errors.endDate = 'End date cannot come before start date';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(404).json({
      message: 'Bad Request',
      errors: errors,
    });
  }

  const spotToBook = await Spot.findByPk(spotId);
  // console.log(spotToBook)
  if (!spotToBook) return res.status(403).json({ message: "The property you are trying to book could not be found" })
  if (spotToBook.ownerId === userId) return res.status(403).json({ message: 'The owner of a property is not allowed to book that property'})
  // TAKE CARE OF BOOKING CONFLICT ERRORS HERE
  const existingBookings = await Booking.findAll({
    where: { spotId },
    attributes: ['id', 'startDate', 'endDate']
  });
  console.log(existingBookings)

  for (let existingBooking of existingBookings) {
    const existingStartDate = new Date(existingBooking.startDate);
    const existingEndDate = new Date(existingBooking.endDate);
    const proposedStartDate = new Date(startDate);
    const proposedEndDate = new Date(endDate);

      if (proposedStartDate >= existingStartDate && proposedStartDate < existingEndDate) errors.startDate = 'Start date conflicts with an existing booking'
      if (proposedEndDate > existingStartDate && proposedEndDate <= existingEndDate) errors.endDate = 'End date conflicts with an existing booking'
      if (proposedStartDate < existingStartDate && proposedEndDate > existingEndDate) errors.schedule = 'Your booking encompasses an existing booking'
      {
      if (Object.keys(errors).length >= 3) break;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: errors,
    });
  }

  const newBooking = await Booking.create({
    userId,
    spotId,
    startDate,
    endDate,
  })
  res.json(newBooking);
});


router.get('/:spotId', requireAuth, async (req, res, next) => {
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
    error.status = 404;
    error.message = 'That property could not be found';
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


router.put('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {address, city, state, country, lat, lng, name, description, price } = req.body;
  const editSpot = await Spot.findByPk(spotId);
  if (!editSpot) return res.status(404).json({ message : "That property could not be found"})
  if (editSpot.ownerId !== userId) {
    const err = new Error();
    err.status = 403;
    err.message = 'You are forbidden from editing properties that do not belong to you.'
    throw err;
  };

  const errors = {};
  if (!address) errors.address = 'Street address is required.';
  if (!city) errors.city = 'City is required.';
  if (!state) errors.state = 'State is required.';
  if (!country) errors.country = 'Country is required.';
  if (!name) errors.name = 'Name is required.';
  if (name) {
    if (name.length > 49) errors.name = 'Name must be less than 50 characters.';
  }
  if (!description) errors.description = 'Description is required.';
  if (!price) errors.price = 'Price per day is required.';
  if (!lat) errors.lat = 'Latitude is not valid.';
  if (!lng) errors.lng = 'Longitude is not valid.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: errors,
  });
  }

  editSpot.address = address;
  editSpot.city = city;
  editSpot.country = country;
  editSpot.name = name;
  editSpot.description = description;
  editSpot.price = price;
  editSpot.lat = lat;
  editSpot.lng = lng;
  res.json(editSpot)
})


router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const deleteSpot = await Spot.findByPk(spotId);
  if (!deleteSpot) return res.status(404).json({message: "That property could not be found"})
  if (deleteSpot.ownerId !== userId) {
    const err = new Error();
    err.status = 403;
    err.message = 'You are forbidden from deleting properties that do not belong to you.'
    throw err;
  };

  await deleteSpot.destroy();
  res.status(200).json({message: "Successfully deleted"})
})


router.post('/', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  console.log(req.user.id)
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = {};
  console.log(name)
  if (!address) errors.address = 'Street address is required.';
  if (!city) errors.city = 'City is required.';
  if (!state) errors.state = 'State is required.';
  if (!country) errors.country = 'Country is required.';
  if (!name) errors.name = 'Name is required.';
  if (name) {
    if (name.length > 49) errors.name = 'Name must be less than 50 characters.';
  }
  if (!description) errors.description = 'Description is required.';
  if (!price) errors.price = 'Price per day is required.';
  if (!lat) errors.lat = 'Latitude is not valid.';
  if (!lng) errors.lng = 'Longitude is not valid.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: errors,
  });
  }

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
  res.status(201).json(newSpot)
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

  const spotAverageRatings = {};

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
