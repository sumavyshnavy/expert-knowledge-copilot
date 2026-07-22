"use client";

import { useEffect, useState } from "react";

import MetricCard from "./MetricCard";
import RecentDocuments from "./RecentDocuments";
import AIActivity from "./AIActivity";
import ComplianceCard from "./ComplianceCard";
import KnowledgeOverview from "./KnowledgeOverview";

import {
  FileText,
  Network,
  GitBranch,
  MessageSquare,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

interface DashboardData {
  documents: number;
  keywords: number;
  relationships: number;
  queries: number;
  compliance: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData>({
    documents: 0,
    keywords: 0,
    relationships: 0,
    queries: 0,
    compliance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch(`${API}/dashboard`);

      if (!res.ok) {
        throw new Error("Failed to load dashboard");
      }

      const data = await res.json();

      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 bg-slate-950 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Expert Knowledge Copilot
        </h1>

        <p className="mt-2 text-slate-400">
          Live analytics from your uploaded knowledge base.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Documents"
          value={loading ? "..." : String(stats.documents)}
          subtitle="Uploaded PDFs"
          icon={FileText}
        />

        <MetricCard
          title="Keywords"
          value={loading ? "..." : String(stats.keywords)}
          subtitle="Knowledge Graph"
          icon={Network}
          color="text-green-400"
        />

        <MetricCard
          title="Relationships"
          value={loading ? "..." : String(stats.relationships)}
          subtitle="Graph Connections"
          icon={GitBranch}
          color="text-cyan-400"
        />

        <MetricCard
          title="AI Queries"
          value={loading ? "..." : String(stats.queries)}
          subtitle="Conversation Memory"
          icon={MessageSquare}
          color="text-blue-400"
        />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <RecentDocuments />

        <AIActivity />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <KnowledgeOverview />

        <ComplianceCard score={stats.compliance} />

      </div>

    </main>
  );
}
