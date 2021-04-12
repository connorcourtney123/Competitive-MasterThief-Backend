'use strict';
const models = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await models.user.bulkCreate([
      { name : 'Connor',
        username: 'CocoSavage',
        score: '5',
        wins: '3',
        losses: '0',
        password: 'Connor'},
      { name: 'Annie',
        username: 'BuggleGlum',
        score: '6',
        wins: '2',
        losses: '0',
        password: 'Annie'
      },
      { name : 'Emma',
        username: 'EmmaGem',
        score: '2',
        wins: '4',
        losses: '0',
        password: 'Emma'}
    ])


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
