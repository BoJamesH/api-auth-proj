'use strict';

const { ReviewImage } = require('../models');

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://example.com/image1.jpg'
      },
      {
        reviewId: 2,
        url: 'https://example.com/image2.jpg'
      },
      {
        reviewId: 3,
        url: 'https://example.com/image3.jpg'
      },
      {
        reviewId: 4,
        url: 'https://example.com/image4.jpg'
      },
      {
        reviewId: 5,
        url: 'https://example.com/image5.jpg'
      },
      {
        reviewId: 6,
        url: 'https://example.com/image6.jpg'
      },
      {
        reviewId: 7,
        url: 'https://example.com/image7.jpg'
      },
      {
        reviewId: 8,
        url: 'https://example.com/image8.jpg'
      },
      {
        reviewId: 9,
        url: 'https://example.com/image9.jpg'
      },
      {
        reviewId: 10,
        url: 'https://example.com/image10.jpg'
      },
      {
        reviewId: 11,
        url: 'https://example.com/image11.jpg'
      },
      {
        reviewId: 12,
        url: 'https://example.com/image12.jpg'
      },
      {
        reviewId: 13,
        url: 'https://example.com/image13.jpg'
      },
      {
        reviewId: 14,
        url: 'https://example.com/image14.jpg'
      },
      {
        reviewId: 15,
        url: 'https://example.com/image15.jpg'
      },
      {
        reviewId: 16,
        url: 'https://example.com/image16.jpg'
      },
      {
        reviewId: 17,
        url: 'https://example.com/image17.jpg'
      },
      {
        reviewId: 18,
        url: 'https://example.com/image18.jpg'
      },
      {
        reviewId: 19,
        url: 'https://example.com/image19.jpg'
      },
      {
        reviewId: 20,
        url: 'https://example.com/image20.jpg'
      },
      {
        reviewId: 21,
        url: 'https://example.com/image21.jpg'
      },
      {
        reviewId: 22,
        url: 'https://example.com/image22.jpg'
      },
      {
        reviewId: 23,
        url: 'https://example.com/image23.jpg'
      },
      {
        reviewId: 24,
        url: 'https://example.com/image24.jpg'
      },
      {
        reviewId: 25,
        url: 'https://example.com/image25.jpg'
      },
      {
        reviewId: 26,
        url: 'https://example.com/image26.jpg'
      },
      {
        reviewId: 27,
        url: 'https://example.com/image27.jpg'
      },
      {
        reviewId: 28,
        url: 'https://example.com/image28.jpg'
      },
      {
        reviewId: 29,
        url: 'https://example.com/image29.jpg'
      },
      {
        reviewId: 30,
        url: 'https://example.com/image30.jpg'
      },
      {
        reviewId: 31,
        url: 'https://example.com/image31.jpg'
      },
      {
        reviewId: 32,
        url: 'https://example.com/image32.jpg'
      },
      {
        reviewId: 33,
        url: 'https://example.com/image33.jpg'
      },
      {
        reviewId: 34,
        url: 'https://example.com/image34.jpg'
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, options)
  },
  // order: 6,
};
