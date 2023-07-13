// backend/routes/api/bookings.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const userBookings = await Booking.findAll({
        where: { userId },
        include: [
            {
                model: Spot,
                attributes: { exclude: ['createdAt', 'updatedAt', 'description'] }, // Exclude the description attribute
                include: {
                  model: SpotImage,
                  attributes: ['url'],
                  limit: 1,
                  required: false,
                },
            },
        ],
    });

    if (!userBookings) return res.status(404).json({ message: "No reviews by the current user could be found" })
    // Map the userBookings and modify the Spot object
    const formattedBookings = userBookings.map((booking) => {
        const formattedBooking = booking.toJSON();
        const spot = formattedBooking.Spot;
        if (spot.SpotImages && spot.SpotImages.length > 0) {
          spot.previewImage = spot.SpotImages[0].url;
          delete spot.SpotImages;
        } else {
          spot.previewImage = null;
        }
        return formattedBooking;
      });
    // console.log(formattedBookings)

    res.json( {"Bookings": formattedBookings} )
})


router.put('/:bookingId', requireAuth, async(req, res, next) => {
  const bookingId = req.params.bookingId;
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

  const bookingToEdit = await Booking.findByPk(bookingId)
  if (!bookingToEdit) return res.status(404).json({ message: "Booking could not be found" })
  if (bookingToEdit.userId !== userId) return res.status(403).json({ message: "You are not allowed to edit another user's booking" })
  const currentDate = new Date();
  if (bookingToEdit.endDate <= currentDate) return res.status(403).json({ message: "Past bookings cannot be modified" })

  const spotToBook = await Spot.findByPk(bookingToEdit.spotId);
  console.log(spotToBook)
  if (!spotToBook) return res.status(403).json({ message: "The property you are trying to book could not be found" })

  // TAKE CARE OF BOOKING CONFLICT ERRORS HERE
  const existingBookings = await Booking.findAll({
    where: {
      spotId: bookingToEdit.spotId,
      id: { [Op.ne]: bookingId } // Exclude the booking being edited
    },
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
      if (Object.keys(errors).length >= 2) break;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: errors,
    });
  }

  bookingToEdit.startDate = startDate;
  bookingToEdit.endDate = endDate;
  res.json(bookingToEdit);
});

module.exports = router;
