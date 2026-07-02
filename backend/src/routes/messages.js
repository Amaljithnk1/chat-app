const { Router } = require('express');
const store = require('../store');

const router = Router();

/**
 * GET /api/messages
 * Returns recent chat history so a newly connected client can render
 * something immediately, before any new real-time messages arrive.
 */
router.get('/messages', (req, res) => {
  res.status(200).json({ messages: store.getHistory() });
});

module.exports = router;
