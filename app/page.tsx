"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };
type Chat = { id: string; name: string; mood: string; color: string; messages: Msg[] };

const presetChats: Chat[] = [
  {
    id: "dobby",
    name: "Dobby",
    mood: "Classic",
    color: "#00a884",
    messages: [
      {
        role: "assistant",
        content:
          "Hey there! I'm Dobby — Sentient’s unleashed AI. I’m here to chat, joke, and maybe spark some chaos ⚡️",
      },
    ],
  },
  {
    id: "philosopher",
    name: "Philosopher Dobby",
    mood: "Philosophical",
    color: "#7b61ff",
    messages: [
      {
        role: "assistant",
        content:
          "Some people seek answers, others seek questions. I seek the silence between both. Shall we dive in?",
      },
    ],
  },
  {
    id: "troll",
    name: "Troll Dobby",
    mood: "Chaotic",
    color: "#ff5252",
    messages: [
      {
        role: "assistant",
        content: "LMAO, another human? What kind of meme are we cooking today? 😈",
      },
    ],
  },
];

export default function Page() {
  const [chats, setChats] = useState<Chat[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("whatsenti-chats");
      if (saved) return JSON.parse(saved);
    }
    return presetChats;
  });

  const [activeId, setActiveId] = useState<string | null>(chats[0]?.id || null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeId) || null;

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    localStorage.setItem("whatsenti-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [activeChat?.messages, loading]);

  async function send() {
    if (!activeChat) return;
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = { role: "user", content: text };
    updateMessages(activeChat.id, userMsg);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...activeChat.messages, userMsg],
        mood: activeChat.mood,
      }),
    });

    const data = await res.json();
    updateMessages(activeChat.id, {
      role: "assistant",
      content: data.content || "[No response received]",
    });
    setLoading(false);
  }

  function updateMessages(id: string, msg: Msg) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, messages: [...c.messages, msg] } : c
      )
    );
  }

  function addNewChat() {
    const id = `chat-${Date.now()}`;
    const newChat: Chat = {
      id,
      name: `New Chat ${chats.length + 1}`,
      mood: "Default",
      color: "#2a3942",
      messages: [
        {
          role: "assistant",
          content: "Hi there 👋 I’m Dobby’s clone. What should we talk about?",
        },
      ],
    };
    setChats([newChat, ...chats]);
    setActiveId(id);
  }

  return (
    <div className="h-screen w-screen flex bg-[#0b141a] text-white overflow-hidden font-[Segoe_UI,Helvetica_Neue,sans-serif]">
      <AnimatePresence mode="wait">
        {/* Sidebar */}
        {(!isMobile || !activeChat) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col w-full md:w-[360px] bg-[#111b21] border-r border-[#1f2c34]"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#202c33]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#00a884] rounded-full flex items-center justify-center font-bold text-sm">
                  S
                </div>
                <span className="font-semibold text-lg">Whatsenti</span>
              </div>

              {/* ➕ New Chat Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={addNewChat}
                className="bg-[#00a884] rounded-full text-black w-8 h-8 flex items-center justify-center font-bold shadow-md hover:brightness-110 transition"
                title="New Chat"
              >
                +
              </motion.button>
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {chats.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveId(c.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    c.id === activeId ? "bg-[#2a3942]" : "hover:bg-[#1f2c34]"
                  }`}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.mood}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}

        {/* Chat Section */}
        {(!isMobile || activeChat) && (
          <motion.section
            key="chat"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col relative"
          >
            {activeChat ? (
              <>
                {/* Header */}
                <header className="flex items-center gap-3 bg-[#202c33] px-4 py-3 border-b border-[#0b141a]">
                  {isMobile && (
                    <button
                      onClick={() => setActiveId(null)}
                      className="text-[#00a884] text-2xl mr-1"
                    >
                      ←
                    </button>
                  )}
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: activeChat.color }}
                  >
                    {activeChat.name[0].toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold">{activeChat.name}</div>
                    <div className="text-xs text-gray-400">online</div>
                  </div>
                </header>

                {/* Messages */}
                <div
                  ref={ref}
                  className="flex-1 overflow-y-auto p-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_9e8b5f73b2b37be2f4b9b702c2040b7c.png')] bg-repeat bg-[#0b141a]"
                >
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {activeChat.messages.map((m, i) => (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`flex ${
                            m.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-3 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                              m.role === "user"
                                ? "bg-[#005C4B] text-white rounded-tl-lg rounded-br-none"
                                : "bg-[#202c33] text-white rounded-tr-lg rounded-bl-none"
                            }`}
                          >
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {loading && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-start"
                      >
                        <div className="bg-[#202c33] px-3 py-2 rounded-lg text-sm text-gray-300 flex gap-1 items-center">
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            •
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          >
                            •
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          >
                            •
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Input */}
                <motion.footer
                  className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#0b141a]"
                  initial={false}
                  animate={{ backgroundColor: loading ? "#182229" : "#202c33" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full bg-[#2a3942] text-white px-4 py-2 outline-none placeholder:text-gray-300 text-[15px]"
                    animate={{ scale: input ? 1.02 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  />
                  <motion.button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#00a884] text-white font-medium px-4 py-2 rounded-full disabled:opacity-50 shadow hover:brightness-110 transition"
                  >
                    Send
                  </motion.button>
                </motion.footer>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                Select a chat or start a new one.
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}