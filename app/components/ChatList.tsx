"use client";
import { Chat } from "./useChats";

export default function ChatList({
  chats,
  activeId,
  onSelect,
  onNew,
}: {
  chats: Chat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="flex flex-col h-full bg-[#111b21] border-r border-[#1f2c34]">
      <div className="flex items-center justify-between px-4 py-3 bg-[#202c33]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[#00a884] rounded-full flex items-center justify-center text-sm font-bold">
            S
          </div>
          <span className="font-semibold">Whatsenti</span>
        </div>
        <button
          onClick={onNew}
          className="text-[#00a884] text-lg font-bold hover:scale-110 transition"
        >
          ＋
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {chats.length === 0 ? (
          <div className="p-4 text-sm text-gray-400">
            Henüz sohbet yok. Yeni sohbet oluştur.
          </div>
        ) : (
          chats.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`p-3 cursor-pointer ${
                c.id === activeId ? "bg-[#2a3942]" : "hover:bg-white/5"
              }`}
            >
              <div className="text-white font-medium">{c.name}</div>
              <div className="text-sm text-gray-400 truncate">
                {c.messages.at(-1)?.content ?? "Henüz mesaj yok"}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}