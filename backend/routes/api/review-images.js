// backend/routes/api/review-images.js
const express = require('express');
const { Spot, User, ReviewImage, Booking, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    // console.log(userId)
    // console.log(imageId)
    const deleteReviewImage = await ReviewImage.findByPk(imageId);
    // console.log(deleteReviewImage)
    // console.log(deleteReviewImage.reviewId)
    const reviewInQuestion = await Review.findByPk(deleteReviewImage.reviewId)
    // console.log(reviewInQuestion)
    if (!deleteReviewImage) return res.status(404).json({message: "That image could not be found"})
    if (reviewInQuestion.userId !== userId) {
      const err = new Error();
      err.status = 403;
      err.message = 'You are forbidden from deleting images that do not belong to your reviews.'
      throw err;
    };

    await deleteReviewImage.destroy();
    res.status(200).json({message: "Successfully deleted"})
})

module.exports = router;
