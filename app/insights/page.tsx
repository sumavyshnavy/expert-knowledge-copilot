"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API = "http://127.0.0.1:8000";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
];

export default function InsightsPage() {
  const [dashboard, setDashboard] = useState({
    documents: 0,
    keywords: 0,
    relationships: 0,
    queries: 0,
    compliance: 0,
  });

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const dash = await fetch(`${API}/dashboard`);
      const dashData = await dash.json();
      setDashboard(dashData);

      const docs = await fetch(`${API}/documents`);
      const docData = await docs.json();
      setDocuments(docData);
    } catch (err) {
      console.log(err);
    }
  }

  const pieData = [
    {
      name: "Documents",
      value: dashboard.documents,
    },
    {
      name: "Keywords",
      value: dashboard.keywords,
    },
    {
      name: "Relations",
      value: dashboard.relationships,
    },
  ];

  const barData = [
    {
      name: "Documents",
      value: dashboard.documents,
    },
    {
      name: "Keywords",
      value: dashboard.keywords,
    },
    {
      name: "Relations",
      value: dashboard.relationships,
    },
    {
      name: "Queries",
      value: dashboard.queries,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-8">

          <h1 className="text-4xl font-bold text-white">
            Knowledge Insights
          </h1>

          <p className="mt-2 text-slate-400">
            Live analytics generated from uploaded documents.
          </p>

          <div className="mt-8 grid grid-cols-4 gap-5">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">Documents</p>
              <h2 className="mt-2 text-4xl font-bold text-white">
                {dashboard.documents}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">Keywords</p>
              <h2 className="mt-2 text-4xl font-bold text-green-400">
                {dashboard.keywords}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">Relationships</p>
              <h2 className="mt-2 text-4xl font-bold text-blue-400">
                {dashboard.relationships}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">AI Queries</p>
              <h2 className="mt-2 text-4xl font-bold text-yellow-400">
                {dashboard.queries}
              </h2>
            </div>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="mb-5 text-xl font-bold text-white">
                Knowledge Distribution
              </h2>

              <div className="h-[320px]">

                <ResponsiveContainer>

                  <PieChart>

                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={110}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="mb-5 text-xl font-bold text-white">
                Platform Statistics
              </h2>

              <div className="h-[320px]">

                <ResponsiveContainer>

                  <BarChart data={barData}>

                    <CartesianGrid stroke="#334155" />

                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                    />

                    <YAxis stroke="#94a3b8" />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-5 text-xl font-bold text-white">
              Uploaded Documents
            </h2>

            <div className="space-y-3">

              {documents.map((doc) => (

                <div
                  key={doc.filename}
                  className="flex justify-between rounded-lg bg-slate-800 p-4"
                >

                  <span className="text-white">
                    {doc.filename}
                  </span>

                  <span className="text-slate-400">
                    {doc.size}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
