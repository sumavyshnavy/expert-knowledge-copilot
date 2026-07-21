const API_URL = "http://127.0.0.1:8000";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}

export async function askAI(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return response.json();
}

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Dashboard failed");
  }

  return response.json();
}
export async function getDocuments() {
  const res = await fetch(`${API_URL}/documents`);

  if (!res.ok) throw new Error("Documents failed");

  return res.json();
}

export async function getKnowledgeGraph() {
  const res = await fetch(`${API_URL}/knowledge-graph`);

  if (!res.ok) throw new Error("Graph failed");

  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_URL}/history`);

  if (!res.ok) throw new Error("History failed");

  return res.json();
}