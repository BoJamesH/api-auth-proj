'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
      })
    }
  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    stars: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
