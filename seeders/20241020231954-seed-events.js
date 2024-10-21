'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [{
      eventId: 1,
      totalTickets: 10,
      availableTickets: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', { eventId: 1 }, {});
  }
};
