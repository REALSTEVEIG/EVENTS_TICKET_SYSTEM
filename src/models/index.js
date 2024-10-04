const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const Event = require('./event')(sequelize, DataTypes);
const Booking = require('./booking')(sequelize, DataTypes);
const WaitingList = require('./waitingList')(sequelize, DataTypes);

Event.hasMany(Booking, { foreignKey: 'eventId' });
Event.hasMany(WaitingList, { foreignKey: 'eventId' });
Booking.belongsTo(Event, { foreignKey: 'eventId' });
WaitingList.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  sequelize,
  Event,
  Booking,
  WaitingList,
};
