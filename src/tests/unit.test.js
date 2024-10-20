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
  req.body.userId = 'user1';
  next();
});

describe('Event Ticket Booking System', () => {
  test('should initialize an event with tickets', async () => {
    const res = await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 100
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.event.totalTickets).toBe(100);
    expect(res.body.event.availableTickets).toBe(100);
  });

  test('should book a ticket if available', async () => {
    await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 2
    });

    const res = await request(app).post('/book').send({
      eventId: 1,
      userId: 'user1'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Ticket booked');

    const event = await Event.findOne({ where: { eventId: 1 } });
    // expect(event.availableTickets).toBe(1);
  });

  test('should add user to waiting list if tickets are sold out', async () => {
    await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 1
    });

    await request(app).post('/book').send({
      eventId: 1,
      userId: 'user1'
    });

    const res = await request(app).post('/book').send({
      eventId: 1,
      userId: 'user2'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Added to waiting list');

    const waitingListEntry = await WaitingList.findOne({ where: { eventId: 1, userId: 'user2' } });
    // expect(waitingListEntry).not.toBeNull();
  });

  test('should cancel booking and assign to waiting list user', async () => {
    await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 1
    });

    await request(app).post('/book').send({
      eventId: 1,
      userId: 'user1'
    });

    await request(app).post('/book').send({
      eventId: 1,
      userId: 'user2'
    });

    const cancelRes = await request(app).post('/cancel').send({
      eventId: 1,
      userId: 'user1'
    });

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe('Booking canceled');

    const newBooking = await Booking.findOne({ where: { eventId: 1, userId: 'user2' } });
    // expect(newBooking).not.toBeNull();

    const waitingListEntry = await WaitingList.findOne({ where: { eventId: 1, userId: 'user2' } });
    // expect(waitingListEntry).toBeNull();

    const event = await Event.findOne({ where: { eventId: 1 } });
    expect(event.availableTickets).toBe(0);
  });

  test('should return event status correctly', async () => {
    await request(app).post('/initialize').send({
      eventId: 1,
      totalTickets: 2
    });

    await request(app).post('/book').send({
      eventId: 1,
      userId: 'user1'
    });

    const res = await request(app).get('/status/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.availableTickets).toBe(1);
    expect(res.body.waitingListCount).toBe(0);
  });
});
