module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      totalTickets: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      availableTickets: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
    
    return Event;
  };
  