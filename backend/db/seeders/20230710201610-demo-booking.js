'use strict';

const { Booking } = require('../models');

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-09-07'),
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2023-09-03'),
        endDate: new Date('2023-09-10'),
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2023-09-05'),
        endDate: new Date('2023-09-12'),
      },
      {
        spotId: 7,
        userId: 4,
        startDate: new Date('2023-09-07'),
        endDate: new Date('2023-09-14'),
      },
      {
        spotId: 10,
        userId: 1,
        startDate: new Date('2023-09-10'),
        endDate: new Date('2023-09-17'),
      },
      {
        spotId: 13,
        userId: 2,
        startDate: new Date('2023-09-13'),
        endDate: new Date('2023-09-20'),
      },
      {
        spotId: 15,
        userId: 3,
        startDate: new Date('2023-09-15'),
        endDate: new Date('2023-09-22'),
      },
      {
        spotId: 9,
        userId: 4,
        startDate: new Date('2023-09-17'),
        endDate: new Date('2023-09-24'),
      },
      {
        spotId: 17,
        userId: 1,
        startDate: new Date('2023-09-20'),
        endDate: new Date('2023-09-27'),
      },
      {
        spotId: 12,
        userId: 2,
        startDate: new Date('2023-09-22'),
        endDate: new Date('2023-09-29'),
      }
    ], options)
  },
  async down (queryInterface, Sequelize) {
    // options.tableName = 'Bookings';
    await queryInterface.bulkDelete('Bookings', null, options)
  },
  // order: 4,
};
