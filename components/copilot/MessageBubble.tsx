interface MessageBubbleProps {
  role: "user" | "assistant";
  message: string;
}

export default function MessageBubble({
  role,
  message,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
