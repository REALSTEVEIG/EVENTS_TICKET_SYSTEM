module.exports = (sequelize, DataTypes) => {
    const WaitingList = sequelize.define('WaitingList', {
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
  
    return WaitingList;
  };
  