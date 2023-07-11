'use strict';

const { Review } = require('../models');

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'What a magical experience staying at Weasleys\' Wizard Wheezes! The jokes and pranks were top-notch, and the Weasley twins were delightful hosts. Highly recommended!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Our stay at Weasleys\' Wizard Wheezes was absolutely hilarious! The shop was filled with ingenious magical items, and Fred and George were brilliant hosts. We had a fantastic time!',
        stars: 4
      },
      // Spot 2 Reviews
      {
        spotId: 2,
        userId: 3,
        review: 'Staying at The White House was an incredible experience! The historical significance and grandeur of the place left us in awe. The staff was also very accommodating. Highly recommended!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Our stay at The White House was memorable. The architecture and history of the place were impressive, but we encountered some issues with the cleanliness. Overall, it was a unique experience.',
        stars: 3
      },
      // Spot 3 Reviews
      {
        spotId: 3,
        userId: 1,
        review: 'As a Sherlock Holmes fan, visiting the Sherlock Holmes Museum was a dream come true. The attention to detail and the artifacts on display were amazing. A must-visit for any detective enthusiast!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 2,
        review: 'The Sherlock Holmes Museum was a delight! The ambiance and recreated scenes from the stories made me feel like I was stepping into Sherlock Holmes\' world. A truly immersive experience.',
        stars: 4
      },
      // Spot 4 Reviews
      {
        spotId: 4,
        userId: 3,
        review: 'Staying at the Black Family House was like stepping into the world of Harry Potter. The house had a mysterious aura, and we felt a connection to the wizarding world. An enchanting experience!',
        stars: 5
      },
      {
        spotId: 4,
        userId: 4,
        review: 'Our stay at the Black Family House was average. The location was great for Harry Potter fans, but the property lacked proper maintenance. It didn\'t live up to our expectations.',
        stars: 3
      },
      // Spot 5 Reviews
      {
        spotId: 5,
        userId: 1,
        review: 'Wayne Manor was a truly luxurious experience! The grandeur and elegance of the residence were unmatched. Alfred provided excellent service, making our stay exceptional.',
        stars: 5
      },
      {
        spotId: 5,
        userId: 2,
        review: 'Staying at Wayne Manor was like living in a castle. The Batcave tour and the incredible amenities made our stay memorable. It was an unforgettable experience!',
        stars: 4
      },
      // Spot 6 Reviews
      {
        spotId: 6,
        userId: 3,
        review: 'Nightmare House was the scariest place we\'ve ever been to! The haunted atmosphere and the presence of Freddy Krueger made our stay a thrilling nightmare. Only for the brave!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 4,
        review: 'Our stay at Nightmare House was quite terrifying. The eerie ambiance and the spine-chilling experiences left us with sleepless nights. Not recommended for the faint of heart!',
        stars: 3
      },
      // Spot 7 Reviews
      {
        spotId: 7,
        userId: 1,
        review: 'Visiting the Sherlock Holmes Museum was a fascinating experience. The displays and artifacts brought the world of Sherlock Holmes to life. A must-visit for all the fans!',
        stars: 4
      },
      {
        spotId: 7,
        userId: 2,
        review: 'The Sherlock Holmes Museum was a treat for any Sherlock Holmes enthusiast. The attention to detail and the immersive experience made it a memorable visit.',
        stars: 4
      },
      // Spot 8 Reviews
      {
        spotId: 8,
        userId: 3,
        review: 'Staying at Space Station V was an out-of-this-world experience! Floating in zero gravity and witnessing the vastness of space was mind-blowing. A truly unique adventure!',
        stars: 5
      },
      {
        spotId: 8,
        userId: 4,
        review: 'Our stay at Space Station V was an extraordinary experience. The futuristic setting and the breathtaking views of space left us in awe. It was a once-in-a-lifetime opportunity.',
        stars: 5
      },
      // Spot 9 Reviews
      {
        spotId: 9,
        userId: 1,
        review: 'Bag End was a charming and cozy hobbit hole. The lush surroundings and the comforts of home made it a delightful retreat. A perfect place for any Lord of the Rings fan!',
        stars: 4
      },
      {
        spotId: 9,
        userId: 2,
        review: 'Our stay at Bag End was like stepping into the pages of The Lord of the Rings. The tranquil setting and the warm hospitality of Bilbo and Frodo made it a memorable experience. Highly recommended for all Middle Earth enthusiasts!',
        stars: 5
      },
      // Spot 10 Reviews
      {
        spotId: 10,
        userId: 3,
        review: 'Staying at Stark Castle was like living in a medieval fantasy. The grandeur and history of the place were captivating. A must-visit for Game of Thrones fans!',
        stars: 5
      },
      {
        spotId: 10,
        userId: 4,
        review: `Our stay at Stark Castle was impressive. The castle's architecture and the surrounding landscapes were breathtaking. It truly felt like stepping into the world of Game of Thrones.`,
        stars: 4
      },
      // Spot 11 Reviews
      {
        spotId: 11,
        userId: 1,
        review: 'The Mandalorian Hideout was a secret sanctuary in a galaxy far, far away. The connection to the Mandalorian culture and the intriguing atmosphere made it an unforgettable experience.',
        stars: 5
      },
      {
        spotId: 11,
        userId: 2,
        review: 'Staying at the Mandalorian Hideout was an adventure on its own. The mysterious ambiance and the spirit of the Mandalorians transported us to a different world. A unique and memorable stay!',
        stars: 4
      },
      // Spot 12 Reviews
      {
        spotId: 12,
        userId: 3,
        review: 'Minas Tirith was a majestic city straight out of The Lord of the Rings. The grandeur of the architecture and the rich history made it an awe-inspiring destination. A dream come true for any Middle Earth enthusiast!',
        stars: 5
      },
      {
        spotId: 12,
        userId: 4,
        review: 'Our stay at Minas Tirith was like living in a fantasy world. The breathtaking views and the sense of being a part of Middle Earth were beyond words. An experience that will stay with us forever.',
        stars: 5
      },
      // Spot 13 Reviews
      {
        spotId: 13,
        userId: 1,
        review: 'Gryffindor Tower was a magical place within the enchanting grounds of Hogwarts. The cozy common room and the sense of belonging were truly special. A must-stay for any Harry Potter fan!',
        stars: 4
      },
      {
        spotId: 13,
        userId: 2,
        review: 'Staying at Gryffindor Tower felt like becoming a part of the wizarding world. The magical ambiance and the whimsical charm made it an extraordinary experience. Highly recommended!',
        stars: 4
      },
      // Spot 14 Reviews
      {
        spotId: 14,
        userId: 3,
        review: 'Citizen Kane\'s Estate was a glimpse into the opulence and intrigue of the film. The grand estate and its history left us captivated. A remarkable stay for cinephiles!',
        stars: 5
      },
      {
        spotId: 14,
        userId: 4,
        review: 'Our stay at Citizen Kane\'s Estate was like stepping into the world of the iconic film. The luxurious surroundings and the timeless elegance made it an unforgettable experience.',
        stars: 4
      },
      // Spot 15 Reviews
      {
        spotId: 15,
        userId: 1,
        review: 'Ahch-To Island was a remote paradise. The scenic beauty and the connection to the Star Wars universe were truly remarkable. A serene getaway for Star Wars fans!',
        stars: 4
      },
      {
        spotId: 15,
        userId: 2,
        review: 'Staying at Ahch-To Island felt like being in a galaxy far, far away. The natural beauty and the sense of serenity were exceptional. An idyllic escape for Star Wars enthusiasts.',
        stars: 4
      },
      // Spot 16 Reviews
      {
        spotId: 16,
        userId: 3,
        review: 'Nebuchadnezzar, the hovercraft from The Matrix, was an extraordinary experience. The futuristic technology and the concept of the virtual world left us in awe. A mind-bending stay!',
        stars: 5
      },
      {
        spotId: 16,
        userId: 4,
        review: 'Our stay aboard the Nebuchadnezzar was like entering a different reality. The immersive experience and the philosophical depth of The Matrix made it a thought-provoking journey.',
        stars: 4
      },
      // Spot 17 Reviews
      {
        spotId: 17,
        userId: 1,
        review: 'Jurassic Park\'s Visitor Center was a thrilling adventure. The interactive exhibits and the opportunity to see dinosaurs up close were an adrenaline rush. A must-visit for Jurassic Park fans!',
        stars: 5
      },
      {
        spotId: 17,
        userId: 2,
        review: 'Staying at Jurassic Park\'s Visitor Center was a dinosaur lover\'s dream come true. The immersive experience and the excitement of seeing real-life dinosaurs were beyond words.',
        stars: 4
      },
    ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options)
  },
  // order: 3,
};
