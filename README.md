# Basic Chat Application

A real-time chat app: **React** frontend + **Spring Boot** backend, using
**WebSocket + STOMP** for live messaging (the Java equivalent of Socket.io).

```
chat-app/
├── backend/    Spring Boot server (Java)
└── frontend/   React app
```

## How it works (big picture)

1. **Login** — `POST /api/auth/login` accepts any non-empty username (dummy
   auth, no password check) and returns `{ username, token }`.
2. **History** — `GET /api/messages` returns all messages sent so far
   (stored in memory), so a new user isn't dropped into an empty room.
3. **Real-time** — the frontend opens a WebSocket to `/ws` using STOMP over
   SockJS. It subscribes to `/topic/messages`. Every message anyone sends
   goes to `/app/chat.send`, the server timestamps and stores it, then
   broadcasts it to `/topic/messages` — so **every connected client
   (including the sender) receives it the same way**. That's what makes
   it "real-time" instead of polling.

```
Browser A  ──publish /app/chat.send──▶  Spring Boot  ──broadcast /topic/messages──▶  Browser A, B, C...
```

## Running the backend

Requires Java 17+ and Maven (or use the included wrapper if you add one).

```bash
cd backend
mvn spring-boot:run
```

Server starts on **http://localhost:8080**.

## Running the frontend

Requires Node.js 16+.

```bash
cd frontend
npm install
npm start
```

App opens on **http://localhost:3000**.

## Try it out

1. Start the backend, then the frontend.
2. Open **http://localhost:3000** in two different browser tabs (or one
   normal + one incognito window, since login is per-tab state).
3. Log in with two different usernames.
4. Send messages from either tab — they appear on both in real time, with
   timestamps.

## Code structure explained

### Backend (`backend/src/main/java/com/chatapp/`)

| Package/file | Responsibility |
|---|---|
| `config/WebSocketConfig.java` | Registers the `/ws` STOMP endpoint and the message broker (`/app` for incoming, `/topic` for broadcast). |
| `config/WebConfig.java` | CORS setup so the React dev server (different port) can call REST endpoints. |
| `controller/AuthController.java` | `POST /api/auth/login` — dummy login. |
| `controller/ChatHistoryController.java` | `GET /api/messages` — REST history fetch. |
| `controller/WebSocketChatController.java` | `@MessageMapping` handlers for `/app/chat.send` and `/app/chat.join` — this is the real-time core. |
| `model/ChatMessage.java` | Message shape: id, sender, content, timestamp, type (CHAT/JOIN/LEAVE). |
| `model/LoginRequest.java`, `LoginResponse.java` | DTOs for the login endpoint. |
| `service/MessageService.java` | In-memory store for message history (swap for a JPA repository + real DB later without touching controllers). |

### Frontend (`frontend/src/`)

| File | Responsibility |
|---|---|
| `App.js` | Top-level switch: shows `Login` or `ChatRoom` based on auth state. |
| `context/AuthContext.js` | Shares the logged-in user across components via `useAuth()`, avoids prop-drilling. |
| `services/authService.js` | REST calls: login, fetch history. |
| `services/socketService.js` | Wraps STOMP/SockJS connection setup, subscribe, publish — components never touch STOMP directly. |
| `components/Login/Login.js` | Login form, calls `authService.login`, then `loginUser()` from context. |
| `components/Chat/ChatRoom.js` | Owns the socket connection lifecycle (connect on mount, disconnect on unmount), holds the `messages` array in state. |
| `components/Chat/MessageList.js` | Scrollable list, auto-scrolls to bottom on new message. |
| `components/Chat/Message.js` | Single message bubble — different style for own vs. others' messages, plus system (join/leave) notices. |
| `components/Chat/MessageInput.js` | Controlled input + send button, Enter-to-send. |

## Notes on design choices

- **WebSocket + STOMP over Socket.io**: Socket.io is a Node.js library; since
  the backend is Spring Boot, STOMP-over-WebSocket is the standard
  equivalent and ships built into Spring (`spring-boot-starter-websocket`).
- **In-memory storage**: kept intentionally simple per the "keep it clean"
  brief. `MessageService` is the only place that would need to change to
  add persistence (e.g. Spring Data JPA + PostgreSQL/MySQL).
- **Dummy auth**: no password hashing, no real user table, no JWT
  validation — matches the "can be dummy for now" requirement. The seam is
  `AuthController` + `LoginRequest`/`LoginResponse` if you want to make it
  real later.
- **Component-based frontend**: each piece (Login, ChatRoom, MessageList,
  Message, MessageInput) has one job and no component talks to the network
  directly — that's isolated in `services/`.

## Possible next steps

- Persist messages to a real database (JPA + MySQL/Postgres).
- Real JWT-based auth with password hashing (BCrypt) and a user table.
- Multiple chat rooms (currently a single global room, `/topic/messages`).
- "User is typing…" indicator, read receipts, message editing/deletion.
- Convert the React frontend to React Native for an actual mobile app
  (the `services/` and `context/` layers would port over almost unchanged —
  only the component JSX/styling would need React Native equivalents like
  `View`/`Text`/`TextInput` instead of `div`/`input`).
