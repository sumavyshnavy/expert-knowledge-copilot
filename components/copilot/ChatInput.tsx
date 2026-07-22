"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  }

  return (
    <div className="flex gap-3">

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Ask anything about your knowledge base..."
        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white outline-none focus:border-blue-500"
      />

      <button
        onClick={handleSend}
        className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Send
      </button>

    </div>
  );
}
