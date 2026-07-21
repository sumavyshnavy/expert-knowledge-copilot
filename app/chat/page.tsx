"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/Frontend/components/layout/Sidebar";
import Topbar from "@/Frontend/components/layout/Topbar";
import { askAI as askAIBackend } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const suggestedQuestions = [
    "Summarize the uploaded document",
    "Explain PPE requirements",
    "What happened in the Incident Report?",
    "List the maintenance checklist",
  ];

  function getCurrentTime() {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  }

  useEffect(() => {
    setMounted(true);

    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your Expert Knowledge Copilot. Ask me anything about your uploaded SOPs, manuals, maintenance logs or incident reports.",
        time: getCurrentTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function askAI(question?: string) {
    const prompt = question || input;

    if (!prompt.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
      time: getCurrentTime(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await askAIBackend(prompt);

      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer,
        time: getCurrentTime(),
      };

      setMessages([
        ...updatedMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "❌ Unable to connect to the backend. Make sure FastAPI is running.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex flex-1 flex-col p-8">
          <h1 className="text-4xl font-bold text-white">
            AI Knowledge Assistant
          </h1>

          <p className="mt-2 text-slate-400">
            Ask questions about SOPs, manuals, maintenance documents and
            incident reports.
          </p>

          <div className="mt-8 flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 max-h-[60vh]">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`w-full max-w-5xl rounded-2xl px-6 py-5 shadow-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      {message.role === "assistant" ? (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                            AI
                          </div>

                          <div>
                            <p className="font-semibold">
                              Expert Copilot
                            </p>

                            <p className="text-xs text-slate-400">
                              AI Assistant
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                            Y
                          </div>

                          <div>
                            <p className="font-semibold">
                              You
                            </p>
                          </div>
                        </div>
                      )}

                      <span className="text-xs opacity-70">
                        {message.time}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap leading-8">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-800 px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                        AI
                      </div>

                      <div>
                        <p className="font-semibold">
                          Expert Copilot
                        </p>

                        <div className="mt-2 flex gap-2">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:0.15s]"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:0.3s]"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex flex-wrap gap-3">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => askAI(question)}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white transition hover:border-blue-500 hover:bg-slate-800"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your uploaded documents..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none transition focus:border-blue-500"
              />

              <button
                onClick={() => askAI()}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-10 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Ask AI"}
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Press <span className="font-semibold">Enter</span> to send •{" "}
              <span className="font-semibold">Shift + Enter</span> for a new
              line
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}