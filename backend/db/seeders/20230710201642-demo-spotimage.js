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
        url: 'https://images.unsplash.com/photo-1600717707657-53775bc58050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjgzNQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.unsplash.com/photo-1559599238-308793637427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjg3Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://images.unsplash.com/photo-1595032186144-1a5bcc537f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjg5Mw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.unsplash.com/photo-1602081850519-24694aee87e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjkwOQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.unsplash.com/photo-1533044309907-0fa3413da946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjk0OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://images.unsplash.com/photo-1626455613245-066bf428283c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjk3Mw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.unsplash.com/photo-1564306974309-54efd9b2b008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMjk4Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzAwMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://images.unsplash.com/photo-1591121213541-c93b6e74c47a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzAxOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://images.unsplash.com/photo-1577910178010-05e9d070b529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzAzMQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 11,
        url: 'https://images.unsplash.com/photo-1586711696425-561bb5fd9f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzA0OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 12,
        url: 'https://images.unsplash.com/photo-1525517710769-9f4fdb9e4099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzA2Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 13,
        url: 'https://images.unsplash.com/photo-1597844710201-33561cc5023c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzA4Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 14,
        url: 'https://images.unsplash.com/photo-1599489757164-4d6c9d9218fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzA5Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 15,
        url: 'https://images.unsplash.com/photo-1591825381767-c7137b8eda0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzEyNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      },
      {
        spotId: 16,
        url: 'https://images.unsplash.com/photo-1595560006870-71deded44269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzEzNg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: true
      },
      {
        spotId: 17,
        url: 'https://images.unsplash.com/photo-1612746240313-734c396e8459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YWlyYm5ifHx8fHx8MTY5MDgzMzE1NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
        preview: false
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkDelete(options)
  },
};
