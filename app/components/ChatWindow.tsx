"use client";
import { useEffect, useRef, useState } from "react";
import { Chat, Message } from "./useChats";

export default function ChatWindow({
  chat,
  onSend,
  loading,
  onBack,
  isMobile,
}: {
  chat: Chat | null;
  onSend: (msg: string) => void;
  loading: boolean;
  onBack: () => void;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages, loading]);

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Sohbet seç.
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-[#0b141a]">
      <header className="flex items-center gap-3 bg-[#202c33] px-4 py-3">
        {isMobile && (
          <button onClick={onBack} className="text-[#00a884] text-xl mr-2">
            ←
          </button>
        )}
        <div className="h-8 w-8 rounded-full bg-[#00a884] flex items-center justify-center font-bold">
          {chat.name[0].toUpperCase()}
        </div>
        <div className="leading-tight">
          <div className="font-semibold">{chat.name}</div>
          <div className="text-xs text-gray-400">çevrim içi</div>
        </div>
      </header>

      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#005C4B] text-white rounded-tr-sm"
                  : "bg-[#202c33] text-white rounded-tl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] px-3 py-2 rounded-lg text-sm text-gray-300">
              Yazıyor…
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#1f2c34] p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend(input)}
          placeholder="Mesaj yazın…"
          className="flex-1 bg-[#2a3942] px-4 py-2 rounded-full outline-none placeholder:text-gray-400"
        />
        <button
          onClick={() => onSend(input)}
          disabled={loading || !input.trim()}
          className="bg-[#00a884] px-4 py-2 rounded-full disabled:opacity-50"
        >
          Gönder
        </button>
      </footer>
    </div>
  );
}