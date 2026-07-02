import "./Message.css";


export default function Message({ message, isOwnMessage }) {
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // System messages (JOIN/LEAVE) render as centered notices, not bubbles
  if (message.type === "JOIN" || message.type === "LEAVE") {
    return <div className="message-system">{message.content}</div>;
  }

  return (
    <div className={`message-row ${isOwnMessage ? "own" : "other"}`}>
      <div className={`message-bubble ${isOwnMessage ? "own" : "other"}`}>
        {!isOwnMessage && <div className="message-sender">{message.sender}</div>}
        <div className="message-content">{message.content}</div>
        <div className="message-time">{time}</div>
      </div>
    </div>
  );
}
