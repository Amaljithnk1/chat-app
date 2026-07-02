require('dotenv').config();

const http = require('http');
const https = require('https');
const { Server } = require('socket.io');

const { createApp } = require('./src/app');
const { registerSocketHandlers } = require('./src/socket');

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = createApp();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Chat backend listening on http://0.0.0.0:${PORT}`);
  console.log(`Socket.IO ready. REST API mounted under /api`);

  // Keep-alive ping for Render free tier — prevents the service from
  // spinning down after 15 minutes of inactivity.
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    setInterval(() => {
      https.get(`${RENDER_URL}/health`, (res) => {
        console.log(`[keep-alive] ping ${res.statusCode}`);
      }).on('error', (err) => {
        console.warn(`[keep-alive] ping failed: ${err.message}`);
      });
    }, 14 * 60 * 1000); // every 14 minutes
  }
});
