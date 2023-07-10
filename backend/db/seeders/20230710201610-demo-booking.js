'use strict';

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
        userId: 1,
        startDate: new Date('2023-07-11'),
        endDate: new Date('2023-07-15'),
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2023-07-12'),
        endDate: new Date('2023-07-17'),
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2023-07-15'),
        endDate: new Date('2023-07-19'),
      },
      {
        spotId: 7,
        userId: 4,
        startDate: new Date('2023-07-18'),
        endDate: new Date('2023-07-22'),

      },
      {
        spotId: 10,
        userId: 1,
        startDate: new Date('2023-07-21'),
        endDate: new Date('2023-07-25'),
      },
      {
        spotId: 13,
        userId: 2,
        startDate: new Date('2023-07-25'),
        endDate: new Date('2023-07-30'),
      },
      {
        spotId: 15,
        userId: 3,
        startDate: new Date('2023-07-28'),
        endDate: new Date('2023-08-02'),
      },
      {
        spotId: 18,
        userId: 4,
        startDate: new Date('2023-08-02'),
        endDate: new Date('2023-08-06'),
      },
      {
        spotId: 20,
        userId: 1,
        startDate: new Date('2023-08-05'),
        endDate: new Date('2023-08-09'),
      },
      {
        spotId: 22,
        userId: 2,
        startDate: new Date('2023-08-08'),
        endDate: new Date('2023-08-12'),
      }
    ], options)
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', null, options)
  }
};
