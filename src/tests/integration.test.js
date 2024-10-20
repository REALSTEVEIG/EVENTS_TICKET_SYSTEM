const request = require('supertest');
const app = require('../app');
const { sequelize, Event, Booking, WaitingList } = require("../models/index");

jest.setTimeout(30000);

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error during database synchronization:', error);
  }
});

afterEach(async () => {
  try {
    await Event.destroy({ where: {} });
    await Booking.destroy({ where: {} });
    await WaitingList.destroy({ where: {} });
  } catch (error) {
    console.error('Error during test teardown:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error during closing the database connection:', error);
  }
});

jest.mock('../middleware/authMiddleware.js', () => (req, res, next) => {
  req.headers['authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mjk0NjczNTYsImV4cCI6MTcyOTQ3MDk1Nn0.5FvEmFCMy7oqfvuDdJk9Ju_RTY0SWg-sqyEyndHhvhE';
  req.body.eventId = 1;
  req.body.userId = 1;
  next();
});

describe('Event Ticket Booking System Integration Tests', () => {
  test('should initialize event, book tickets, handle waiting list, cancel bookings', async () => {
    const initRes = await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 2
    });
    expect(initRes.statusCode).toBe(201);
    expect(initRes.body.event.availableTickets).toBe(2);

    const bookRes1 = await request(app).post('/book').send({
      eventId: 1,
      userId: 1
    });
    expect(bookRes1.statusCode).toBe(200);
    expect(bookRes1.body.message).toBe('Ticket booked');

    const bookRes2 = await request(app).post('/book').send({
      eventId: 1,
      userId: 'user2'
    });
    expect(bookRes2.statusCode).toBe(200);
    expect(bookRes2.body.message).toBe('Ticket booked');

    const bookRes3 = await request(app).post('/book').send({
      eventId: 1,
      userId: 'user3'
    });
    expect(bookRes3.statusCode).toBe(200);
    expect(bookRes3.body.message).toBe('Added to waiting list');

    const statusRes1 = await request(app).get('/status/1');
    expect(statusRes1.statusCode).toBe(200);
    expect(statusRes1.body.availableTickets).toBe(0);
    expect(statusRes1.body.waitingListCount).toBe(1);

    const cancelRes = await request(app).post('/cancel').send({
      eventId: 1,
      userId: 1
    });
    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe('Booking canceled');

    const statusRes2 = await request(app).get('/status/1');
    expect(statusRes2.statusCode).toBe(200);
    expect(statusRes2.body.availableTickets).toBe(0);
    expect(statusRes2.body.waitingListCount).toBe(0);
  });

  test('should handle event initialization and ticket cancellations gracefully', async () => {
    const initRes = await request(app).post('/initialize').send({
      eventId: 2,
      totalTickets: 1
    });
    expect(initRes.statusCode).toBe(201);
    expect(initRes.body.event.totalTickets).toBe(1);

    const bookRes = await request(app).post('/book').send({
      eventId: 2,
      userId: 1
    });
    expect(bookRes.statusCode).toBe(200);
    expect(bookRes.body.message).toBe('Ticket booked');

    const cancelRes = await request(app).post('/cancel').send({
      eventId: 2,
      userId: 1
    });
    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe('Booking canceled');

    const statusRes = await request(app).get('/status/2');
    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.availableTickets).toBe(1);
    expect(statusRes.body.waitingListCount).toBe(0);
  });
});
