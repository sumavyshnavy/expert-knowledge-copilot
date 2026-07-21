"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "assistant";
  message: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      message:
        "Hello! I'm your Expert Knowledge Copilot. Ask me anything about your uploaded documents.",
    },
  ]);

  async function sendMessage(question: string) {
    if (!question.trim()) return;

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message: question,
      },
    ]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            data.response ||
            data.answer ||
            data.message ||
            "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            "Unable to connect to the backend. Please check if the FastAPI server is running.",
        },
      ]);
    }
  }

  return (
    <div className="mt-8 flex h-[700px] flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-white">
          🤖 AI Expert Assistant
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Ask questions about your uploaded documents.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            message={msg.message}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-6">
        <ChatInput onSend={sendMessage} />
      </div>

    </div>
  );
}