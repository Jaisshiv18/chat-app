import { useEffect, useRef } from "react";
import Message from "./Message";
import "./MessageList.css";

export default function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="message-list-empty">No messages yet. Say hello!</p>
      )}

      {messages.map((msg) => (
        <Message
          key={msg.id ?? `${msg.sender}-${msg.timestamp}-${Math.random()}`}
          message={msg}
          isOwnMessage={msg.sender === currentUsername}
        />
      ))}

      {/* Invisible anchor element used to scroll to the latest message */}
      <div ref={bottomRef} />
    </div>
  );
}
