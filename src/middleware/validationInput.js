module.exports = (req, res, next) => {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Missing eventId or userId' });
    }
    next();
  };
  