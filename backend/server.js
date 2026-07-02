require('dotenv').config();

const http = require('http');
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
});
