module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'eventId'
        }
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Booking;
  };
  