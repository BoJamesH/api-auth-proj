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
    // console.log(reviewInQuestion)
    if (!deleteReviewImage) return res.status(404).json({message: "That image could not be found"})
    if (deleteReviewImage) {
        const reviewInQuestion = await Review.findByPk(deleteReviewImage.reviewId)
        if (reviewInQuestion.userId !== userId) return res.status(403).json({ message: 'You are not allowed to delete images that do not belong to your reviews' })
    }

    await deleteReviewImage.destroy();
    res.status(200).json({message: "Successfully deleted"})
})

module.exports = router;
