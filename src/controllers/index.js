/**
 * home page
 */
// eslint-disable-next-line new-cap
const router = require('express').Router();
const path = require('path');
const Rooms = require('../models/Rooms');
const { filter, handleError } = require('../utils/verification');

const viewDir = path.join(__dirname, '../views');

router.get('/', filter, (req, res) => {
  res.sendFile(path.join(viewDir, 'index.html'));
});

router.post('/rooms', filter, async (req, res) => {
  const [err, rooms] = await handleError(Rooms.getRooms());
  if (err) {
    res.json({ code: 1, desc: err.message });
    return;
  }
  res.json({ code: 0, data: { rooms } });
});

router.post('/mode', filter, (req, res) => {
  if (!req.body.id) {
    res.json({ code: 1, desc: '没有提供id' });
    return;
  }
  req.session.user.roomId = parseInt(req.body.id, 10);
  res.json({ code: 0, data: { next: '/game' } });
});

module.exports = router;
