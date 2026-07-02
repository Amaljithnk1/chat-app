const { v4: uuidv4 } = require('uuid');
const store = require('./store');

/**
 * Wires up all Socket.IO event handling.
 *
 * Events (client -> server):
 *  - "join"        { userId, username }        register this socket as a user
 *  - "sendMessage" { text }                     broadcast a chat message
 *  - "typing"      { isTyping: boolean }        broadcast typing state
 *
 * Events (server -> client):
 *  - "history"        Message[]                 sent once, right after join
 *  - "message"         Message                  a new message arrived
 *  - "presence"        { users: {userId, username}[] }   who's online now
 *  - "typing"          { userId, username, isTyping }
 */
function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    let currentUser = null;

    socket.on('join', (payload = {}) => {
      const { userId, username } = payload;
      if (typeof username !== 'string' || username.trim().length === 0) {
        socket.emit('errorMessage', { error: 'username is required to join' });
        return;
      }

      currentUser = {
        userId: userId || uuidv4(),
        username: username.trim().slice(0, 24),
      };

      store.addOnlineUser(socket.id, currentUser);

      // Catch this client up on recent history, then broadcast presence
      // to everyone (including the newly joined client).
      socket.emit('history', store.getHistory());
      io.emit('presence', { users: store.getOnlineUsers() });
    });

    socket.on('sendMessage', (payload = {}) => {
      if (!currentUser) {
        socket.emit('errorMessage', { error: 'you must join before sending messages' });
        return;
      }

      const text = typeof payload.text === 'string' ? payload.text.trim() : '';
      if (!text) return;

      const message = store.addMessage({
        id: uuidv4(),
        userId: currentUser.userId,
        username: currentUser.username,
        text: text.slice(0, 2000),
        timestamp: new Date().toISOString(),
      });

      io.emit('message', message);
    });

    socket.on('typing', (payload = {}) => {
      if (!currentUser) return;
      io.except(socket.id).emit('typing', {
        userId: currentUser.userId,
        username: currentUser.username,
        isTyping: Boolean(payload.isTyping),
      });
    });

    socket.on('disconnect', () => {
      store.removeOnlineUser(socket.id);
      io.emit('presence', { users: store.getOnlineUsers() });
    });
  });
}

module.exports = { registerSocketHandlers };
