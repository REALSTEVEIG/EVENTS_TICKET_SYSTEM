const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { initializeRoutes } = require('./routes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); 

app.use(bodyParser.json());

initializeRoutes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
