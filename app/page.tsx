"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/custom/MarkdownRenderer";
import { BrainCircuit, Trash, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    setChats((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setChats((prev) => [
      ...prev,
      { role: "ai", content: data.answer || "No response" },
    ]);
    setMessage("");
    setLoading(false);
  };
  // Load chats from localStorage on mount
  useEffect(() => {
    const storedChats = localStorage.getItem("chatHistory");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chats));
  }, [chats]);

  const handleDeleteChats = () => {
    setChats([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">
        🎓 Ask the AI 
      </h1>
      <div className="mb-4 max-h-96 overflow-y-auto flex flex-col gap-2">
        {chats.map((chat, idx) => (
          <div
            key={idx}
            className="flex gap-3"
          >
            {chat.role === "user" && (
              <div className="rounded-full bg-blue-500 text-white w-9 h-9 p-2 flex items-center justify-center text-sm">
                <User />
              </div>
            )}
            <div
              className={`p-3 rounded-md ${
                chat.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left"
              }`}
            >              
              <MarkdownRenderer content={chat.content} className="mt-2" />
            </div>
            {chat.role === "ai" && (
              <div className="rounded-full text-gray-100 bg-black w-9 h-9 p-2 flex items-center justify-center text-sm">
                <BrainCircuit />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-md bg-gray-100 text-left">
            <strong>AI:</strong> Thinking...
          </div>
        )}
      </div>
      <form onSubmit={handleChat} className="flex gap-2">
        <Input
          placeholder="Ask a question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </form>
      <Button
        variant="destructive"
        className="mt-4 w-full"
        onClick={handleDeleteChats}
        disabled={loading || chats.length === 0}
      >
        <Trash />
      </Button>
    </div>
  );
}
