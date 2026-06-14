"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../hook/useChat";
import Message from "./Message";

export default function ChatRoom({ username, roomId, onLeave }) {
  const { messages, members, status, typingUsers, sendMessage, handleTyping } =
    useChat({ roomId, username });

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [inviteCopied, setInviteCopied] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  function submit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status !== "connected") return;
    sendMessage(text);
    setInput("");
  }

  function copyInviteLink() {
    const link = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);

    setTimeout(() => setInviteCopied(false), 2000);
  }

  const statusColor = {
    connecting: "bg-yellow-400",
    connected: "bg-green-500",
    error: "bg-red-500",
    idle: "bg-gray-400",
  }[status];

  return (
    <div className="flex h-screen bg-zinc-950 text-white">

      {/* Sidebar */}
      <aside className="w-[220px] flex flex-col border-r border-zinc-800 bg-zinc-900">

        {/* Logo */}
        <div className="p-5 border-b border-zinc-800 flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center font-bold">
            L
          </div>
          <span className="font-bold text-sm">LiveChat</span>
        </div>

        {/* Room info */}
        <div className="p-4 border-b border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Current room
          </p>

          <p className="font-mono text-indigo-400 text-sm mt-1">
            #{roomId}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="text-xs text-zinc-400 capitalize">
              {status}
            </span>
          </div>

          {/* 🔥 INVITE BUTTON */}
          <button
            onClick={copyInviteLink}
            className="w-full mt-3 text-xs border border-indigo-500 text-indigo-400 rounded-md py-2 hover:bg-indigo-500 hover:text-black transition"
          >
            {inviteCopied ? "Link Copied ✓" : "🔗 Get Invite Link"}
          </button>
        </div>

        {/* Members */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
            Online · {members.length}
          </p>

          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: stringToColor(m.username) }}
                >
                  {m.username[0]?.toUpperCase()}
                </div>

                <span
                  className={`text-sm truncate ${
                    m.username === username
                      ? "text-indigo-400 font-semibold"
                      : "text-zinc-200"
                  }`}
                >
                  {m.username}
                  {m.username === username && (
                    <span className="text-zinc-500 font-normal"> (you)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={onLeave}
            className="w-full text-sm border border-zinc-700 text-zinc-400 rounded-md py-2 hover:border-red-500 hover:text-red-500 transition"
          >
            ← Leave room
          </button>
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
          <div>
            <h1 className="font-bold">#{roomId}</h1>
            <p className="text-xs text-zinc-500 font-mono">
              {members.length} member(s) · ephemeral chat
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1 border border-zinc-700 rounded-full text-zinc-400">
            {username}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          {messages.length === 0 && status === "connected" && (
            <div className="text-center text-zinc-500 mt-16 text-sm">
              💬 No messages yet<br />
              Be the first in #{roomId}
            </div>
          )}

          {status === "connecting" && (
            <div className="text-center text-zinc-500 mt-16 text-sm">
              Connecting...
            </div>
          )}

          {messages.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              isOwn={msg.sender?.username === username}
            />
          ))}

          {/* Typing */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 py-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"
                  />
                ))}
              </div>

              {typingUsers.join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={submit}
          className="p-4 border-t border-zinc-800 flex gap-2 bg-zinc-900"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            placeholder={`Message #${roomId}`}
            maxLength={500}
            disabled={status !== "connected"}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || status !== "connected"}
            className="px-5 py-2 rounded-lg text-sm font-bold transition bg-indigo-500 text-black disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            Send →
          </button>
        </form>
      </main>
    </div>
  );
}

/* deterministic avatar color */
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}