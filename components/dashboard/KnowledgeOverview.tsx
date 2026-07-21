"use client";

import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function KnowledgeOverview() {

  const [stats, setStats] = useState({
    documents: 0,
    keywords: 0,
    relationships: 0,
    queries: 0,
    compliance: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    try {

      const res = await fetch(`${API}/dashboard`);

      if (!res.ok) return;

      const data = await res.json();

      setStats(data);

    } catch (err) {

      console.log(err);

    }

  }

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold text-white">
        Knowledge Overview
      </h2>

      <div className="mt-6 space-y-5">

        <div className="flex justify-between">
          <span className="text-slate-400">Documents</span>
          <span className="font-bold text-white">
            {stats.documents}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Keywords</span>
          <span className="font-bold text-green-400">
            {stats.keywords}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Relationships</span>
          <span className="font-bold text-blue-400">
            {stats.relationships}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">AI Queries</span>
          <span className="font-bold text-cyan-400">
            {stats.queries}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Compliance</span>
          <span className="font-bold text-emerald-400">
            {stats.compliance}%
          </span>
        </div>

      </div>

    </div>

  );

}