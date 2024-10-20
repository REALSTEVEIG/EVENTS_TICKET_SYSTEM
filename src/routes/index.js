const jwt = require('jsonwebtoken');
const eventController = require('../controllers/eventController');
const authorization = require('../middleware/authMiddleware')
const validation = require('../middleware/validationInput')

const initializeRoutes = (app) => {
  app.post('/initialize', eventController.initializeEvent);
  app.post('/book', validation, authorization, eventController.bookTicket);
  app.post('/cancel', authorization, eventController.cancelTicket);  
  app.get('/status/:eventId', eventController.getEventStatus);

  app.post('/login', (req, res) => {
    const { userId } = req.body;
        const user = { id: userId, role: 'user' };
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });  
    res.json({ accessToken });
  });
};

module.exports = { initializeRoutes };
