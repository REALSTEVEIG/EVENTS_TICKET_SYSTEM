const app = require('./src/app');
const { sequelize } = require('./src/models');

const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
