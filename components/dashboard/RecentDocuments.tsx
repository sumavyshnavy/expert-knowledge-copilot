"use client";

import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

interface DocumentItem {
  filename: string;
  size: string;
}

export default function RecentDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const res = await fetch(`${API}/documents`);

      if (!res.ok) return;

      const data = await res.json();

      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold text-white">
        Uploaded Documents
      </h2>

      <div className="mt-6 space-y-4">

        {documents.length === 0 && (
          <p className="text-slate-400">
            No documents uploaded.
          </p>
        )}

        {documents.map((doc, index) => (

          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
          >

            <div>

              <h3 className="font-semibold text-white">
                {doc.filename}
              </h3>

              <p className="text-sm text-slate-400">
                {doc.size}
              </p>

            </div>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
              Indexed
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}