"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/Frontend/components/layout/Sidebar";
import Topbar from "@/Frontend/components/layout/Topbar";

import { getDashboard, getDocuments } from "@/lib/api";

type DashboardData = {
  documents: number;
  keywords: number;
  relationships: number;
  queries: number;
  compliance: number;
};

type DocumentData = {
  filename: string;
  size: string;
};

export default function EquipmentPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboardData = await getDashboard();
        const documentData = await getDocuments();

        setDashboard(dashboardData);
        setDocuments(documentData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="p-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold text-white">
                Knowledge Assets
              </h1>

              <p className="mt-2 text-slate-400">
                Live statistics from your uploaded knowledge base.
              </p>

            </div>

          </div>

          <div className="mt-8 grid grid-cols-4 gap-5">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-slate-400">
                Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {dashboard?.documents ?? 0}
              </h2>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-slate-400">
                Keywords
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {dashboard?.keywords ?? 0}
              </h2>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-slate-400">
                Relationships
              </p>

              <h2 className="mt-2 text-3xl font-bold text-cyan-400">
                {dashboard?.relationships ?? 0}
              </h2>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-slate-400">
                AI Queries
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {dashboard?.queries ?? 0}
              </h2>

            </div>

          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <table className="w-full">

              <thead className="bg-slate-800">

                <tr>

                  <th className="p-4 text-left text-slate-300">
                    Document
                  </th>

                  <th className="p-4 text-left text-slate-300">
                    Size
                  </th>

                  <th className="p-4 text-left text-slate-300">
                    Status
                  </th>

                  <th className="p-4 text-left text-slate-300">
                    Knowledge Graph
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="p-8 text-center text-slate-400"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : documents.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="p-8 text-center text-slate-400"
                    >
                      No uploaded documents.
                    </td>

                  </tr>

                ) : (

                  documents.map((doc, index) => (

                    <tr
                      key={index}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >

                      <td className="p-4 text-white">
                        {doc.filename}
                      </td>

                      <td className="p-4 text-slate-300">
                        {doc.size}
                      </td>

                      <td className="p-4">

                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                          Indexed
                        </span>

                      </td>

                      <td className="p-4 text-cyan-400">
                        Connected
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}