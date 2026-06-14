"use client";

export default function Message({ msg, isOwn }) {
  if (msg.type === "SYSTEM") {
    return (
      <div className="text-center py-1 text-[11px] font-mono text-zinc-500 opacity-70 animate-fade-in">
        — {msg.text} —
      </div>
    );
  }

  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 mb-1 animate-fade-in ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      {!isOwn && (
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{
            background: stringToColor(msg.sender?.username || "?"),
          }}
        >
          {msg.sender?.username?.[0]?.toUpperCase() || "?"}
        </div>
      )}

      <div className="max-w-[72%] flex flex-col gap-1">
        {/* Username */}
        {!isOwn && (
          <span className="text-[11px] font-mono text-zinc-500 pl-0.5">
            {msg.sender?.username}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed break-words ${
            isOwn
              ? "bg-indigo-500 text-black rounded-br-sm"
              : "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>

        {/* Time */}
        <span
          className={`text-[10px] font-mono text-zinc-500 px-0.5 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {time}
        </span>
      </div>
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