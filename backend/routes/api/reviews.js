// backend/routes/api/reviews.js
// Import the express package
const express = require('express');
const { Spot, User, SpotImage, ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router()

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const userReviews = await Review.findAll({
        where: { userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: SpotImage,
                    attributes: ['url'],
                    limit: 1,
                    required: false,
                }
            },
            {
              model: ReviewImage,
              attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] },
            },
        ],
    });
    if (!userReviews) return res.status(404).json({ message: "No reviews by the current user could be found" })
    // Map the userReviews and modify the Spot object
    const formattedReviews = userReviews.map((review) => {
        const formattedReview = review.toJSON();
        const spot = formattedReview.Spot;
        if (spot.SpotImages && spot.SpotImages.length > 0) {
          spot.previewImage = spot.SpotImages[0].url;
          delete spot.SpotImages;
        } else {
          spot.previewImage = null;
        }
        return formattedReview;
      });
    console.log(formattedReviews)
    res.json( {"Reviews": formattedReviews} )
})

// router.get('/')

module.exports = router;
