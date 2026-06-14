"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

export const useChat = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [typingUsers, setTypingUsers] = useState([]);

  const ws = useRef(null); // ✅ FIX 1
  const typingTimer = useRef(null);

  // ---- Connect ------------------------------------------------------------
  useEffect(() => {
    if (!roomId || !username) return;

    setStatus("connecting");

    const socket = new WebSocket(WS_URL);

    ws.current = socket; // ✅ now valid

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "JOIN",
          roomId,
          username,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "ROOM_JOINED":
          setStatus("connected");
          setMessages(data.history || []);
          setMembers(data.members || []);
          break;

        case "MESSAGE":
        case "SYSTEM":
          setMessages((prev) => [...prev, data]);
          break;

        case "MEMBERS_UPDATE":
          setMembers(data.members || []);
          break;

        case "TYPING":
          setTypingUsers((prev) => {
            const filtered = prev.filter((u) => u !== data.username);
            return data.isTyping
              ? [...filtered, data.username]
              : filtered;
          });
          break;

        case "ERROR":
          console.error(data.message);
          break;

        default:
          break;
      }
    };

    socket.onerror = () => setStatus("error");
    socket.onclose = () => setStatus("idle");

    return () => {
      socket.close();
    };
  }, [roomId, username]);

  // ---- Send message -------------------------------------------------------
  const sendMessage = useCallback((text) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "MESSAGE", text })
      );
    }
  }, []);

  // ---- Typing -------------------------------------------------------------
  const sendTyping = useCallback((isTyping) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "TYPING", isTyping })
      );
    }
  }, []);

  const handleTyping = useCallback(() => {
    sendTyping(true);
    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      sendTyping(false);
    }, 1500);
  }, [sendTyping]);

  return {
    messages,
    members,
    status,
    typingUsers,
    sendMessage,
    handleTyping,
  };
};