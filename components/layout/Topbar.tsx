"use client";

import { Bell, Search, Sparkles } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">

      <div>

        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-slate-400">
          Industrial Knowledge Intelligence Platform
        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 w-96">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            placeholder="Search documents, equipment, SOPs..."
            className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
          />

        </div>

        <button className="rounded-xl bg-slate-900 p-3 hover:bg-slate-800 transition">

          <Bell className="text-white" />

        </button>

        <button className="rounded-xl bg-blue-600 p-3 hover:bg-blue-700 transition">

          <Sparkles className="text-white" />

        </button>

      </div>

    </header>
  );
}
