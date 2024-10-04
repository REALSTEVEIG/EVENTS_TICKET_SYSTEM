'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      eventId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      totalTickets: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      availableTickets: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
