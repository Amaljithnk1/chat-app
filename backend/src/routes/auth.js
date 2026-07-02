const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');

const router = Router();

/**
 * POST /api/login
 * Dummy login: no password, no persistence. Any non-empty username
 * "logs in" and gets back a fake token + userId the client can use to
 * identify itself over the socket connection.
 *
 * Body: { username: string }
 * Response: { userId, username, token }
 */
router.post('/login', (req, res) => {
  const { username } = req.body || {};

  if (typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'username is required' });
  }

  const trimmed = username.trim().slice(0, 24);

  return res.status(200).json({
    userId: uuidv4(),
    username: trimmed,
    // Not a real JWT — this is a placeholder to demonstrate where a real
    // auth token would go once actual authentication is added.
    token: Buffer.from(`${trimmed}:${Date.now()}`).toString('base64'),
  });
});

module.exports = router;
