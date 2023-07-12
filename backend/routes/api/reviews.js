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

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const thisReviewId = req.params.reviewId;
    const userId = req.user.id;
    const { url } = req.body;
    const review = await Review.findByPk(thisReviewId);

    if (!review) return res.status(404).json({ message: 'Review could not be found' })
    if (review.userId !== userId) {
        const err = new Error();
        err.status = 403;
        err.message = 'You are forbidden from adding pictures to reviews that do not belong to you.'
        throw err;
    };

    const imageCount = await ReviewImage.count({
        where: {
          reviewId: thisReviewId,
        },
    });
    if (imageCount > 9) return res.status(403).json({ message: 'Maximum number of images for this resource was reached' })
    const newReviewImage = await ReviewImage.create({
        reviewId: thisReviewId,
        url,
    });

    const { createdAt, updatedAt, reviewId, ...newReviewImageData } = newReviewImage.toJSON();
    res.json(newReviewImageData);
})

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
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

    const existingReview = await Review.findByPk(reviewId)
    if (!existingReview) return res.status(404).json({ message: "Review could not be found" })
    if (existingReview.userId !== userId) {
        const err = new Error();
        err.status = 403;
        err.message = 'You are forbidden from editing properties that do not belong to you.'
        throw err;
    };

    existingReview.review = review;
    existingReview.stars = stars;
    res.json(existingReview)
})

module.exports = router;
