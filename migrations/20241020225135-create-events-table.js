'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      totalTickets: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      availableTickets: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
