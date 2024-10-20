const { Event, sequelize, Booking, WaitingList } = require('../models');

exports.bookTicket = async (req, res) => {
  const { eventId, userId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findOne({ where: { eventId }, lock: transaction.LOCK.UPDATE, transaction });

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets > 0) {
      await Booking.create({ eventId, userId }, { transaction });
      await event.decrement('availableTickets', { by: 1, transaction });
      await transaction.commit();
      return res.status(200).json({ message: 'Ticket booked' });
    } else {
      await WaitingList.create({ eventId, userId }, { transaction });
      await transaction.commit();
      return res.status(200).json({ message: 'Added to waiting list' });
    }
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: 'Error booking ticket', error });
  }
};

exports.cancelTicket = async (req, res) => {
  const { eventId, userId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findOne({ where: { eventId }, lock: transaction.LOCK.UPDATE, transaction });
    const booking = await Booking.findOne({ where: { eventId, userId }, transaction });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.destroy({ transaction });

    const waitingListEntry = await WaitingList.findOne({ where: { eventId }, transaction });
    if (waitingListEntry) {
      await Booking.create({ eventId, userId: waitingListEntry.userId }, { transaction });
      await waitingListEntry.destroy({ transaction });
    } else {
      await event.increment('availableTickets', { by: 1, transaction });
    }

    await transaction.commit();
    return res.status(200).json({ message: 'Booking canceled' });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: 'Error canceling booking', error });
  }
};

exports.initializeEvent = async (req, res) => {
  try {
    const { eventId, totalTickets } = req.body;
    const event = await Event.create({ eventId, totalTickets, availableTickets: totalTickets });
    res.status(201).json({ message: 'Event initialized', event });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing event', error });
  }
};

exports.getEventStatus = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ where: { eventId } });
    const waitingListCount = await WaitingList.count({ where: { eventId } });
    res.status(200).json({
      eventId,
      availableTickets: event.availableTickets,
      waitingListCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event status', error });
  }
};
