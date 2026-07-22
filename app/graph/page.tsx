"use client";

import dynamic from "next/dynamic";

const ReactFlow = dynamic(
  () => import("@xyflow/react").then((mod) => mod.ReactFlow),
  {
    ssr: false,
  }
);
import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const API = "http://127.0.0.1:8000";

export default function GraphPage() {
  const [search, setSearch] = useState("");

  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    loadGraph();
  }, []);

  async function loadGraph() {
    try {
      const response = await fetch(`${API}/knowledge-graph`);
      const data = await response.json();

      const graphNodes: Node[] = data.nodes.map((node: any) => ({
        id: node.id,

        position: {
          x: Math.random() * 900,
          y: Math.random() * 700,
        },

        data: {
          label: node.label,
        },

        style: {
          background:
            node.type === "document"
              ? "#2563eb"
              : "#059669",

          color: "white",

          border: "1px solid #334155",

          borderRadius: 12,

          padding: 10,

          width: 170,
        },
      }));

      const graphEdges: Edge[] = data.edges.map(
        (edge: any, index: number) => ({
          id: String(index),

          source: edge.source,

          target: edge.target,

          animated: true,

          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        })
      );

      setAllNodes(graphNodes);
      setAllEdges(graphEdges);

      setNodes(graphNodes);
      setEdges(graphEdges);
    } catch (err) {
      console.log(err);
    }
  }

  const filteredNodes = useMemo(() => {
    if (!search) return allNodes;

    return allNodes.filter((node) =>
      String(node.data.label)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, allNodes]);

  useEffect(() => {
    setNodes(filteredNodes);
    setEdges(allEdges);
  }, [filteredNodes, allEdges, setNodes, setEdges]);

  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold text-white">
                Knowledge Graph
              </h1>

              <p className="mt-2 text-slate-400">
                Live relationships extracted from uploaded documents.
              </p>

            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white outline-none"
            />

          </div>

          <div className="grid grid-cols-4 gap-5 mb-6">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-slate-400">
                Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {
                  allNodes.filter(
                    (n) => n.style?.background === "#2563eb"
                  ).length
                }
              </h2>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-slate-400">
                Keywords
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {
                  allNodes.filter(
                    (n) => n.style?.background === "#059669"
                  ).length
                }
              </h2>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-slate-400">
                Connections
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {allEdges.length}
              </h2>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-slate-400">
                Status
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                Live
              </h2>

            </div>

          </div>

          <div className="h-[75vh] overflow-hidden rounded-2xl border border-slate-800">

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >

              <MiniMap />

              <Controls />

              <Background />

            </ReactFlow>

          </div>

        </main>

      </div>

    </div>
  );
}
