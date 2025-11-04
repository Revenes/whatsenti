"use client";
import { useState, useEffect } from "react";

export type Message = { role: "user" | "assistant"; content: string };
export type Chat = { id: string; name: string; messages: Message[] };

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("whatsenti-chats");
    if (saved) setChats(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("whatsenti-chats", JSON.stringify(chats));
  }, [chats]);

  function createChat(name: string) {
    const newChat: Chat = { id: crypto.randomUUID(), name, messages: [] };
    setChats((c) => [...c, newChat]);
    setActiveId(newChat.id);
  }

  function addMessage(chatId: string, msg: Message) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c
      )
    );
  }

  return { chats, activeId, setActiveId, createChat, addMessage };
}