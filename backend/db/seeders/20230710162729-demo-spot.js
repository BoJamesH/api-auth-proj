'use strict';
const {Spot} = require('../models')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '45 Diagon Alley',
        city: 'London',
        state: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lng: -0.1278,
        name: 'Weasleys\' Wizard Wheezes',
        description: 'A whimsical joke shop run by Fred and George Weasley.',
        price: 2200
      },
      {
        ownerId: 1,
        address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        country: 'United States',
        lat: 38.8977,
        lng: -77.0365,
        name: 'The White House',
        description: 'The official residence and workplace of the President of the United States.',
        price: 3800
      },
      {
        ownerId: 1,
        address: '221B Baker Street',
        city: 'London',
        state: 'London',
        country: 'United Kingdom',
        lat: 51.5141,
        lng: -0.1557,
        name: 'Sherlock Holmes Museum',
        description: 'A museum dedicated to the famous detective Sherlock Holmes.',
        price: 2500
      },
      {
        ownerId: 1,
        address: '12 Grimmauld Place',
        city: 'London',
        state: 'London',
        country: 'United Kingdom',
        lat: 51.5299,
        lng: -0.1163,
        name: 'Black Family House',
        description: 'The ancestral home of the Black family in the Harry Potter series.',
        price: 2000
      },
      {
        ownerId: 1,
        address: 'Gotham City',
        city: 'Gotham',
        state: 'Gotham',
        country: 'United States',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Wayne Manor',
        description: 'The luxurious residence of Bruce Wayne, also known as Batman.',
        price: 3000
      },
      {
        ownerId: 2,
        address: '123 Elm Street',
        city: 'Springwood',
        state: 'Ohio',
        country: 'United States',
        lat: 39.7589,
        lng: -84.1916,
        name: 'Nightmare House',
        description: 'A haunted house that is the domain of Freddy Krueger in the Nightmare on Elm Street series.',
        price: 1800
      },
      {
        ownerId: 2,
        address: '221B Baker Street',
        city: 'London',
        state: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lng: -0.1278,
        name: 'Sherlock Holmes Museum',
        description: 'A museum dedicated to the famous detective Sherlock Holmes.',
        price: 2500
      },
      {
        ownerId: 2,
        address: '2001: A Space Odyssey',
        city: 'Space Station V',
        state: 'Space',
        country: 'Unknown',
        lat: 0,
        lng: 0,
        name: 'Space Station V',
        description: 'A futuristic space station depicted in the film 2001: A Space Odyssey.',
        price: 3200
      },
      {
        ownerId: 2,
        address: 'The Shire',
        city: 'Hobbiton',
        state: 'The Shire',
        country: 'Middle Earth',
        lat: 122538.234,
        lng: 943928.231,
        name: 'Bag End',
        description: 'The home of Bilbo and Frodo Baggins in The Lord of the Rings.',
        price: 2100
      },
      {
        ownerId: 3,
        address: 'Winterfell',
        city: 'Winterfell',
        state: 'The North',
        country: 'Westeros',
        lat: 54.3683,
        lng: -5.5813,
        name: 'Stark Castle',
        description: 'The ancestral seat of House Stark in Game of Thrones.',
        price: 2700
      },
      {
        ownerId: 3,
        address: 'Mandalore',
        city: 'Mandalore',
        state: 'Outer Rim',
        country: 'Star Wars Galaxy',
        lat: -28.0167,
        lng: 153.4000,
        name: 'Mandalorian Hideout',
        description: 'A secret hideout of the Mandalorians, a warrior culture in Star Wars.',
        price: 2900
      },
      {
        ownerId: 3,
        address: 'Gondor',
        city: 'Minas Tirith',
        state: 'Gondor',
        country: 'Middle Earth',
        lat: -41.2865,
        lng: 174.7762,
        name: 'Minas Tirith',
        description: 'The fortified city and capital of Gondor in The Lord of the Rings.',
        price: 2600
      },
      {
        ownerId: 3,
        address: 'Hogwarts School of Witchcraft and Wizardry',
        city: 'Hogsmeade',
        state: 'Scotland',
        country: 'United Kingdom',
        lat: 56.0480,
        lng: -3.4000,
        name: 'Gryffindor Tower',
        description: 'The tower that houses the Gryffindor common room in the Harry Potter series.',
        price: 2300
      },
      {
        ownerId: 4,
        address: 'Xanadu',
        city: 'Xanadu',
        state: 'Xanadu',
        country: 'Xanadu',
        lat: 43.3130,
        lng: 77.0170,
        name: 'Citizen Kane\'s Estate',
        description: 'The luxurious estate of Charles Foster Kane in the film Citizen Kane.',
        price: 3500
      },
      {
        ownerId: 4,
        address: 'Skellig Michael',
        city: 'County Kerry',
        state: 'Ireland',
        country: 'Ireland',
        lat: 51.7701,
        lng: -10.5426,
        name: 'Ahch-To Island',
        description: 'The remote island where Luke Skywalker lived in Star Wars: The Last Jedi.',
        price: 3300
      },
      {
        ownerId: 4,
        address: 'The Matrix',
        city: 'Mega City',
        state: 'Unknown',
        country: 'Virtual World',
        lat: 0,
        lng: 0,
        name: 'Nebuchadnezzar',
        description: 'The hovercraft ship captained by Morpheus in The Matrix trilogy.',
        price: 3100
      },
      {
        ownerId: 4,
        address: 'Jurassic Park',
        city: 'Isla Nublar',
        state: 'Costa Rica',
        country: 'Central America',
        lat: 9.7554,
        lng: -83.7534,
        name: 'Visitor Center',
        description: 'The main visitor center of Jurassic Park, the theme park filled with genetically resurrected dinosaurs.',
        price: 3600
      }
    ], { validate: true })
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options)
  },
};
