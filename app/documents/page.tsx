"use client";

import { useState, ChangeEvent } from "react";
import Sidebar from "@/Frontend/components/layout/Sidebar";
import Topbar from "@/Frontend/components/layout/Topbar";
import { uploadDocument } from "@/lib/api";

type Document = {
  name: string;
  category: string;
  uploaded: string;
  size: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Safety SOP.pdf",
      category: "SOP",
      uploaded: "11 Jul 2026",
      size: "2.4 MB",
    },
    {
      name: "Incident Report.pdf",
      category: "Incident",
      uploaded: "10 Jul 2026",
      size: "1.1 MB",
    },
    {
      name: "Maintenance Manual.pdf",
      category: "Manual",
      uploaded: "08 Jul 2026",
      size: "6.7 MB",
    },
  ]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const today = () =>
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const detectCategory = (filename: string) => {
    const name = filename.toLowerCase();

    if (name.includes("sop")) return "SOP";
    if (name.includes("manual")) return "Manual";
    if (name.includes("incident")) return "Incident";
    if (name.includes("compliance")) return "Compliance";

    return "General";
  };

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage("");

    try {
      for (const file of Array.from(files)) {
        const result = await uploadDocument(file);

        setDocuments((prev) => [
          {
            name: result.filename,
            category: detectCategory(result.filename),
            uploaded: today(),
            size: formatSize(file.size),
          },
          ...prev,
        ]);
      }

      setUploadMessage("✅ Document uploaded and indexed successfully.");
    } catch (err) {
      console.error(err);
      setUploadMessage("❌ Upload failed.");
    }

    setUploading(false);
    e.target.value = "";
  }

  const deleteDocument = (name: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.name !== name));
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      doc.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Document Library
              </h1>

              <p className="mt-2 text-slate-400">
                Manage SOPs, manuals, compliance documents and reports.
              </p>
            </div>

            <label className="cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
              Upload Document

              <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </div>

          {uploading && (
            <p className="mt-4 text-blue-400">
              Uploading and indexing document...
            </p>
          )}

          {uploadMessage && (
            <p className="mt-4 text-green-400">
              {uploadMessage}
            </p>
          )}

          <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 p-12 text-center transition hover:border-blue-500">
            <p className="text-xl font-semibold text-white">
              Drag & Drop Documents Here
            </p>

            <p className="mt-2 text-slate-400">
              Upload SOPs, manuals, compliance documents or incident reports
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Supported format: PDF
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-blue-500"
            >
              <option>All Categories</option>
              <option>SOP</option>
              <option>Manual</option>
              <option>Incident</option>
              <option>Compliance</option>
              <option>General</option>
            </select>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            {filteredDocuments.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-6xl">📄</div>

                <h2 className="mt-4 text-2xl font-bold text-white">
                  No documents found
                </h2>

                <p className="mt-2 text-slate-400">
                  Upload your first document to get started.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="p-4 text-left text-slate-300">
                      Document
                    </th>

                    <th className="p-4 text-left text-slate-300">
                      Category
                    </th>

                    <th className="p-4 text-left text-slate-300">
                      Uploaded
                    </th>

                    <th className="p-4 text-left text-slate-300">
                      Size
                    </th>

                    <th className="p-4 text-left text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.name}
                      className="border-t border-slate-800 transition hover:bg-slate-800/40"
                    >
                      <td className="p-4 text-white">
                        📄 {doc.name}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                          {doc.category}
                        </span>
                      </td>

                      <td className="p-4 text-slate-300">
                        {doc.uploaded}
                      </td>

                      <td className="p-4 text-slate-300">
                        {doc.size}
                      </td>

                      <td className="flex gap-2 p-4">
                        <button className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600">
                          View
                        </button>

                        <button
                          onClick={() => deleteDocument(doc.name)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}