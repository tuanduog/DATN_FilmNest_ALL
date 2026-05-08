import React, { useEffect } from "react";
import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

export default function Test() {
  useEffect(() => {
    console.log("🚀 useEffect running...");

    const client = new Client({
      brokerURL: "ws://localhost:8099/wsocket",
      // webSocketFactory: () => new SockJS("http://localhost:8099/wsocket"),
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("✅ Successfully connected!");
      client.subscribe("/topic/greetings", (message) => { // nhận
        console.log("📩 Received:", message.body);
      });
      client.publish({ destination: "/app/hello", body: "Xin chào!" }); // gửi
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Protocol Error:", frame.headers.message);
    };

    client.activate();

    return () => client.deactivate();
  }, []);

  return <h2>Test WebSocket thuần</h2>;
}
