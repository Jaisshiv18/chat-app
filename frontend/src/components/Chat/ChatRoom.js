import { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { createSocketConnection } from "../../services/socketService";
import { fetchMessageHistory } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./ChatRoom.css";


export default function ChatRoom() {
  const { user, logoutUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Load prior history first so the room isn't empty on join
    fetchMessageHistory()
      .then((history) => {
        if (isMounted) setMessages(history);
      })
      .catch((err) => console.error("Failed to load history:", err));

    // Then open the live connection
    const socket = createSocketConnection({
      onConnect: () => {
        setConnected(true);
        socket.sendJoin(user.username);
      },
      onMessage: (message) => {
        setMessages((prev) => [...prev, message]);
      },
      onError: (err) => console.error("STOMP error:", err),
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      isMounted = false;
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (text) => {
    socketRef.current?.sendMessage(user.username, text);
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
        <div>
          <h2>Chat App</h2>
          <span className={`status ${connected ? "online" : "offline"}`}>
            {connected ? "Connected" : "Connecting..."}
          </span>
        </div>
        <div className="chat-header-right">
          <span className="chat-username">{user.username}</span>
          <button className="logout-btn" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </header>

      <MessageList messages={messages} currentUsername={user.username} />
      <MessageInput onSend={handleSend} disabled={!connected} />
    </div>
  );
}
