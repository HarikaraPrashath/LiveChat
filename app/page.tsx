"use client";
import { useState } from "react";
import LobbyScreen from "../components/LobbyScreen";
import ChatRoom from "../components/ChatRoom";

type Session = {
  username: string;
  roomId: string;
};

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  return session ? (
    <ChatRoom
      username={session.username}
      roomId={session.roomId}
      onLeave={() => setSession(null)}
    />
  ) : (
    <LobbyScreen
      onJoin={(username: string, roomId: string) =>
        setSession({ username, roomId })
      }
    />
  );
}