import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";


export function createSocketConnection({ onConnect, onMessage, onError }) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000, // auto-retry every 5s if the connection drops
    onConnect: () => {
      // Every client subscribes to the same broadcast topic
      client.subscribe("/topic/messages", (frame) => {
        const message = JSON.parse(frame.body);
        onMessage(message);
      });
      if (onConnect) onConnect();
    },
    onStompError: (frame) => {
      if (onError) onError(frame.headers["message"]);
    },
  });

  return {
    connect: () => client.activate(),
    disconnect: () => client.deactivate(),

    sendJoin: (username) => {
      client.publish({
        destination: "/app/chat.join",
        body: JSON.stringify({ sender: username, content: "" }),
      });
    },

    sendMessage: (username, content) => {
      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({ sender: username, content }),
      });
    },
  };
}
