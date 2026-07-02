/**
 * In-memory data store.
 *
 * This is intentionally NOT a database. The assignment calls for a simple,
 * clean demo, so message history and presence live in memory and reset
 * whenever the server restarts. Swapping this module for a real database
 * (Mongo, Postgres, Redis for presence, etc.) would be the natural next step
 * and would not require touching any of the route or socket handler code,
 * since they only ever talk to the functions exported here.
 */

const MAX_HISTORY = 200;

/** @type {{ id: string, username: string }[]} */
let messages = [];

/** Map of socket.id -> { userId, username } for anyone currently connected. */
const onlineUsers = new Map();

function addMessage(message) {
  messages.push(message);
  if (messages.length > MAX_HISTORY) {
    messages = messages.slice(messages.length - MAX_HISTORY);
  }
  return message;
}

function getHistory() {
  return messages;
}

function addOnlineUser(socketId, user) {
  onlineUsers.set(socketId, user);
}

function removeOnlineUser(socketId) {
  const user = onlineUsers.get(socketId);
  onlineUsers.delete(socketId);
  return user;
}

function getOnlineUsers() {
  // De-duplicate by username in case the same user has multiple sockets/tabs open.
  const seen = new Map();
  for (const user of onlineUsers.values()) {
    seen.set(user.username, user);
  }
  return Array.from(seen.values());
}

module.exports = {
  addMessage,
  getHistory,
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
};
