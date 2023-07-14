'use strict';

const { SpotImage } = require('../models');

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 12,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 13,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 14,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 15,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      },
      {
        spotId: 16,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: true
      },
      {
        spotId: 17,
        url: 'https://source.unsplash.com/random/?airbnb',
        preview: false
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkDelete(options)
  },
};
