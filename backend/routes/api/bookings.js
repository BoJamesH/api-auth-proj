// backend/routes/api/bookings.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

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

module.exports = router;
