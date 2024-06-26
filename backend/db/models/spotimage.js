'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      })
    }
  }
  SpotImage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    spotId: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
