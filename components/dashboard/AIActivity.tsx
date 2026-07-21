"use client";

import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function AIActivity() {

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {

    try {

      const res = await fetch(`${API}/history`);

      if (!res.ok) return;

      const data = await res.json();

      setHistory(data);

    } catch (err) {

      console.log(err);

    }

  }

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold text-white">
        AI Conversation History
      </h2>

      <div className="mt-6 space-y-4 max-h-[420px] overflow-y-auto">

        {history.length === 0 && (

          <p className="text-slate-400">
            No conversations yet.
          </p>

        )}

        {history.map((item, index) => (

          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >

            <p className="text-sm leading-7 text-slate-300">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}