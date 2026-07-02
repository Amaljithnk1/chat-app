# Frequency — Real-Time Chat App

A real-time chat application with a mobile client and a Node.js backend.

- **Frontend:** React Native (Expo, TypeScript) — mobile chat interface
- **Backend:** Node.js + Express + Socket.IO — real-time messaging server
- **Bonus:** dummy username-only login, message timestamps, typing indicator,
  live presence (online user count)

Visual concept: **"Frequency"** — the UI is styled around the idea of a
live signal/transmission (deep petrol background, coral "outgoing signal"
bubbles, amber data readouts for timestamps and connection status) rather
than a generic chat-bubble skin.

---

## 1. Project structure

```
chat-app/
├── backend/                 Node.js + Express + Socket.IO server
│   ├── server.js             entry point (HTTP server + Socket.IO)
│   ├── src/
│   │   ├── app.js             Express app + middleware + route mounting
│   │   ├── socket.js          all Socket.IO event handlers
│   │   ├── store.js           in-memory message history & presence
│   │   └── routes/
│   │       ├── auth.js        POST /api/login (dummy login)
│   │       └── messages.js    GET  /api/messages (history)
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/                 Expo React Native app (TypeScript)
    ├── App.tsx                app entry: loads fonts, wraps providers
    ├── app.json                Expo config (name, icons, bundle ids)
    ├── src/
    │   ├── config.ts           backend URL config (edit this for your IP)
    │   ├── types.ts            shared TS types
    │   ├── theme/               design tokens (colors, fonts, spacing)
    │   ├── context/
    │   │   ├── AuthContext.tsx    dummy login + session persistence
    │   │   └── SocketContext.tsx  Socket.IO connection + chat state
    │   ├── navigation/          Login <-> Chat stack navigator
    │   ├── screens/
    │   │   ├── LoginScreen.tsx
    │   │   └── ChatScreen.tsx
    │   ├── components/          MessageBubble, ConnectionBar, SignalPulse, SignalBackground
    │   └── utils/api.ts         REST helper (login, message history)
    ├── package.json
    └── .gitignore
```

**Why this structure:** the backend separates transport concerns (`app.js`
for REST, `socket.js` for real-time) from storage (`store.js`), so swapping
the in-memory store for a real database later doesn't touch routing or
socket logic. The frontend separates state (contexts) from presentation
(screens/components) and keeps all styling in one `theme` module so the
whole app's look can be changed from a single file.

---

## 2. How real-time messaging works

1. Client calls `POST /api/login` with just a username (no password) and
   gets back a `userId` + `username`.
2. Client connects to the Socket.IO server and emits `join` with that
   identity.
3. Server registers the socket, sends back recent `history`, and broadcasts
   updated `presence` (who's online) to everyone.
4. Sending a message emits `sendMessage`; the server stamps it with a
   timestamp and a generated id, stores it, and broadcasts `message` to all
   connected clients — including the sender, so every client renders from
   the same source of truth.
5. `typing` events are broadcast the same way, with a client-side timeout
   to auto-clear the indicator if a "stopped typing" event is missed.

REST (`GET /api/messages`) is used only so the chat screen has something to
show immediately on load, before the socket handshake finishes — Socket.IO
is the source of truth for anything live.

---

## 3. Running it locally

### Backend

```bash
cd backend
cp .env.example .env      # defaults are fine for local dev
npm install
npm start                  # or: npm run dev (with nodemon)
```

Server runs on `http://localhost:4000` by default. Verify it's up:

```bash
curl http://localhost:4000/health
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

This opens the Expo dev tools. From there you can:
- Press `a` to open in an Android emulator
- Press `i` to open in an iOS simulator (macOS only)
- Scan the QR code with the **Expo Go** app on your own phone

**Important — if testing on a physical phone:** `localhost` in
`frontend/src/config.ts` only works for emulators running on the same
machine as the backend. On a real device, find your computer's LAN IP
(`ipconfig` on Windows, `ifconfig` or `ipconfig getifaddr en0` on macOS)
and update:

```ts
// frontend/src/config.ts
export const API_BASE_URL = 'http://192.168.1.23:4000'; // your LAN IP
```

Your phone and computer need to be on the same Wi-Fi network.

---

## 4. What's deliberately simple (and why)

- **In-memory storage:** no database, so history resets on server restart.
  Swapping in Postgres/Mongo would only require changing `backend/src/store.js`.
- **Dummy login:** any non-empty username logs in — no password or backend
  persistence. Intentional, to keep auth out of scope for now.
- **No message editing/deleting/read-receipts:** kept out of scope to keep
  the core send/receive flow, structure, and client-server communication
  easy to follow.