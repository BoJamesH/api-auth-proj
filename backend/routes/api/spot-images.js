// backend/routes/api/spots.js
const express = require('express');
const { Spot, User, SpotImage, Booking, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    const deleteSpotImage = await SpotImage.findByPk(imageId);
    const spotInQuestion = await Spot.findByPk(deleteSpotImage.spotId)
    if (!deleteSpotImage) return res.status(404).json({message: "That image could not be found"})
    if (spotInQuestion.ownerId !== userId) return res.status(403).json({message: "You are not allowed to delete images that do not belong to your properties"})

    await deleteSpotImage.destroy();
    res.status(200).json({message: "Successfully deleted"})
})

module.exports = router;
