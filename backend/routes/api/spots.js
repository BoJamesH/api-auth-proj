// backend/routes/api/spots.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const { Op } = require('sequelize')
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
  if (!spots) return res.status(404).json({ message: "No reviews by the current user could be found" })
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
  res.status(200).json(response);
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
    res.status(200).json({ 'Reviews': reviewsBySpotId })
});


router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const reviewSpot = await Spot.findByPk(spotId)
  if (!reviewSpot) return res.status(404).json({ message: 'That property could not be found' })
  const userId = req.user.id;
  const { review, stars } = req.body;
  const errors = {};
  if (!review) errors.review = 'Review text is required.';
  if (!stars) errors.starsRequired = 'Star rating is required.';
  if (stars) {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
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
  if (existingReview) return res.status(500).json({ message: "You have already made a review for this property" })

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,
  })
  res.status(201).json(newReview);
});


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { url, preview } = req.body;
  const addImageSpot = await Spot.findByPk(spotId);
  if (!addImageSpot) return res.status(404).json({ message: "That property could not be found" })
  if (addImageSpot.ownerId !== userId) return res.status(403).json({ message: 'You are not allowed to add pictures to properties that do not belong to you' })
  if (!url) return res.status(400).json({ message: "Must provide photo url to add photo" })
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  })
  const response = { "id": newImage.id, "url": url, "preview": preview }
  res.status(201).json(response)
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
  res.status(200).json({ 'Bookings': bookingsBySpotId})
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
  const rightNow = new Date();
  if (new Date(startDate) < rightNow) errors.schedule = 'Bookings must start in the future'
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
  if (!spotToBook) return res.status(404).json({ message: "The property you are trying to book could not be found" })
  if (spotToBook.ownerId === userId) return res.status(403).json({ message: 'The owner of a property is not allowed to book that property'})
  // TAKE CARE OF BOOKING CONFLICT ERRORS HERE
  const existingBookings = await Booking.findAll({
    where: { spotId },
    attributes: ['id', 'startDate', 'endDate']
  });

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
  res.status(201).json(newBooking);
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
  if (!spotById) return res.status(404).json({ message: 'That property could not be found' })

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
  res.status(200).json(response);
})


router.put('/:spotId', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {address, city, state, country, lat, lng, name, description, price } = req.body;
  const editSpot = await Spot.findByPk(spotId);
  if (!editSpot) return res.status(404).json({ message : "That property could not be found"})
  if (editSpot.ownerId !== userId) return res.status(403).json({ message: 'You are not allowed to edit properties that do not belong to you' })

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
  if (lat) {
    if (lat < -90 || lat > 90) errors.lat = 'Latitude is not valid.';
  }
  if (!lat) errors.latReq = 'Latitude is required'
  if (lng) {
    if (lng < -180 || lng > 180) errors.lat = 'Longitude is not valid.';
  }
  if (!lng) errors.lngReq = 'Longitude is required'

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

  if (!deleteSpot) return res.status(404).json({ message: "That property could not be found" });

  if (deleteSpot.ownerId !== userId) return res.status(403).json({ message: 'You are not allowed to delete properties that do not belong to you.' });

  await deleteSpot.destroy();
  res.status(200).json({ message: "Successfully deleted" });
});


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
  if (lat) {
    if (lat < -90 || lat > 90) errors.lat = 'Latitude is not valid.';
  }
  if (!lat) errors.latReq = 'Latitude is required'
  if (lng) {
    if (lng < -180 || lng > 180) errors.lat = 'Longitude is not valid.';
  }
  if (!lng) errors.lngReq = 'Longitude is required'

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
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  const minLat = parseFloat(req.query.minLat);
  const maxLat = parseFloat(req.query.maxLat);
  const minLng = parseFloat(req.query.minLng);
  const maxLng = parseFloat(req.query.maxLng);
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  const queryOptions = {};
  const pagination = {};
  const errors = {};

  if (page !== undefined && page < 1) errors.page = 'Size must be greater than or equal to one';
  if (page === undefined) page = 1;
  if (size !== undefined && size < 1) errors.size = 'Size must be greater than or equal to one';
  if (size === undefined) size = 10;

  if (maxLat && minLat) {
    if (maxLat < -90 || maxLat > 90) errors.maxLat = 'Maximum latitude is invalid';
    if (minLat < -90 || minLat > 90) errors.minLat = 'Minimum latitude is invalid'
    queryOptions.lat = { [Op.between]: [minLat, maxLat] };
  } else if (maxLat && !minLat) {
    if (maxLat < -90 || maxLat > 90) errors.maxLat = 'Maximum latitude is invalid';
    queryOptions.lat = { [Op.lte]: maxLat, };
  } else if (minLat && !maxLat) {
    if (minLat < -90 || minLat > 90) errors.minLat = 'Minimum latitude is invalid'
    queryOptions.lat = { [Op.gte]: minLat, };
  }
  if (maxLng && minLng) {
    if (maxLng < -180 || maxLng > 180) errors.maxLng = 'Maximum longitude is invalid';
    if (minLng < -180 || minLng > 180) errors.minLng = 'Minimum longitude is invalid'
    queryOptions.lng = { [Op.between]: [minLng, maxLng] };
  } else if (maxLng && !minLng) {
    if (maxLng < -180 || maxLng > 180) errors.maxLng = 'Maximum longitude is invalid';
    queryOptions.lng = { [Op.lte]: maxLng, };
  } else if (minLng && !maxLng) {
    if (minLng < -180 || minLng > 180) errors.minLng = 'Minimum longitude is invalid'
    queryOptions.lng = { [Op.gte]: minLng, };
  }
  if (maxPrice && minPrice) {
    if (maxPrice < 0) errors.maxPrice = 'Maximum price must be greater than or equal to zero';
    if (minPrice < 0) errors.minPrice = 'Minimum price must be greater than or equal to zero'
    queryOptions.price = { [Op.between]: [minPrice, maxPrice] };
  } else if (maxPrice && !minPrice) {
    if (maxPrice < 0) errors.maxPrice = 'Maximum price must be greater than or equal to zero';
    queryOptions.price = { [Op.lte]: maxPrice, };
  } else if (minPrice && !maxPrice) {
    if (minPrice < 0) errors.minPrice = 'Minimum price must be greater than or equal to zero'
    queryOptions.price = { [Op.gte]: minPrice, };
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: errors,
  });
  }

  const filteredSpots = await Spot.findAll({
    where: queryOptions,
    attributes: ['id'],
  });

  const allSpots = await Spot.findAll({
    where: {
      id: filteredSpots.map(spot => spot.id)
    },
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
        limit: 1,
      },
    ],
    ...pagination,
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
      spot.price = Number(spot.price);

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
    page: page,
    size: size,
  };
  res.status(200).json(response);
});


module.exports = router;
