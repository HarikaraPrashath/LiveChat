"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LobbyInner({ onJoin }) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const usernameRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    const roomFromUrl = searchParams.get("room");
    if (roomFromUrl) setRoomId(roomFromUrl);
  }, [searchParams]);

  const rooms = ["general", "tech-talk", "random", "announcements"];

  function handleJoin(e) {
    e.preventDefault();

    const u = username.trim();
    const r = roomId.trim();

    if (!u) return setError("Choose a username");
    if (!r) return setError("Choose a room");
    if (u.length < 2)
      return setError("Username must be at least 2 characters");

    onJoin(u, r);
  }

  return (
    <>
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-[fade-up_0.4s_ease]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center animate-pulse">
              💬
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              LiveChat
            </span>
          </div>

          <p className="text-xs font-mono text-zinc-400">
            Real-time · WebSocket · Node.js
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-6">Join a room</h2>

          <form onSubmit={handleJoin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                Username
              </label>

              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="e.g. prashadh"
                maxLength={24}
                className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono outline-none focus:border-indigo-500"
              />
            </div>

            {/* Room */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                Room
              </label>

              {/* quick rooms */}
              <div className="flex flex-wrap gap-2 mb-3">
                {rooms.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRoomId(r);
                      setError("");
                    }}
                    className={`px-3 py-1 text-xs font-mono rounded-full border transition
                      ${
                        roomId === r
                          ? "bg-indigo-500/20 text-indigo-400 border-indigo-500"
                          : "text-zinc-400 border-zinc-700 hover:border-zinc-500"
                      }`}
                  >
                    #{r}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={roomId}
                onChange={(e) => {
                  setRoomId(
                    e.target.value.toLowerCase().replace(/\s/g, "-")
                  );
                  setError("");
                }}
                placeholder="or type a room name"
                maxLength={32}
                className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono outline-none focus:border-indigo-500"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs font-mono">⚠ {error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-500 text-black font-bold hover:opacity-90 active:scale-95 transition"
            >
              Enter Room →
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5 font-mono">
          No account needed · Messages are ephemeral
        </p>
      </div>
    </>
  );
}

export default function LobbyScreen(props) {
  return (
    <Suspense fallback={null}>
      <LobbyInner {...props} />
    </Suspense>
  );
}