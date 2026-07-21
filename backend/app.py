import os
import shutil

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import collection

from dotenv import load_dotenv
from groq import Groq

from rag import add_document, search_documents
from memory import (
    add_user_message,
    add_assistant_message,
    get_history_text,
)

from summarizer import summarize_document
from document_manager import get_documents
from analytics import get_stats
from comparator import compare_documents
from insights import generate_insights
from sources import get_sources
from knowledge_graph import get_graph

# ===================================================
# Load Environment Variables
# ===================================================

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise Exception("GROQ_API_KEY not found")

client = Groq(api_key=api_key)

# ===================================================
# FastAPI
# ===================================================

app = FastAPI(title="Expert Knowledge Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================================================
# Request Models
# ===================================================

class ChatRequest(BaseModel):
    message: str


class CompareRequest(BaseModel):
    file1: str
    file2: str


# ===================================================
# Home
# ===================================================

@app.get("/")
def home():
    return {
        "status": "running",
        "service": "Expert Knowledge Copilot (Groq)"
    }
@app.get("/dashboard")
def dashboard():

    uploads = "uploads"

    documents = 0

    if os.path.exists(uploads):
        documents = len(
            [
                f
                for f in os.listdir(uploads)
                if f.endswith(".pdf")
            ]
        )

    graph = get_graph()

    keywords = len(
        [
            n
            for n in graph["nodes"]
            if n["type"] == "keyword"
        ]
    )

    relationships = len(graph["edges"])

    history = get_history_text()

    queries = 0

    if history.strip():
        queries = len(history.split("\n"))

    return {
        "documents": documents,
        "keywords": keywords,
        "relationships": relationships,
        "queries": queries,
        "compliance": 100 if documents > 0 else 0
    }
@app.get("/history")
def history():

    history = get_history_text()

    messages = []

    if history.strip():

        for line in history.split("\n"):

            if line.strip():

                messages.append(line)

    return messages[-10:]

# ===================================================
# Upload
# ===================================================

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join(
        "uploads",
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = add_document(filepath)

    return {
        "message": "Document uploaded successfully.",
        "chunks_indexed": chunks,
        "filename": file.filename
    }


# ===================================================
# Knowledge Graph
# ===================================================

@app.get("/knowledge-graph")
def knowledge_graph():
    return get_graph()


# ===================================================
# Documents
# ===================================================

@app.get("/documents")
def documents():
    return get_documents()


# ===================================================
# Analytics
# ===================================================

@app.get("/analytics")
def analytics():
    return get_stats()


# ===================================================
# Summarizer
# ===================================================

@app.get("/summarize/{filename}")
def summarize(filename: str):

    filepath = os.path.join(
        "uploads",
        filename
    )

    if not os.path.exists(filepath):
        return {
            "error": "Document not found."
        }

    return {
        "filename": filename,
        "summary": summarize_document(filepath)
    }


# ===================================================
# Compare Documents
# ===================================================

@app.post("/compare")
def compare(data: CompareRequest):

    file1 = os.path.join(
        "uploads",
        data.file1
    )

    file2 = os.path.join(
        "uploads",
        data.file2
    )

    if not os.path.exists(file1):
        return {
            "error": f"{data.file1} not found"
        }

    if not os.path.exists(file2):
        return {
            "error": f"{data.file2} not found"
        }

    return {
        "comparison": compare_documents(
            file1,
            file2
        )
    }


# ===================================================
# Insights
# ===================================================

@app.get("/insights/{filename}")
def insights(filename: str):

    filepath = os.path.join(
        "uploads",
        filename
    )

    if not os.path.exists(filepath):
        return {
            "error": "Document not found."
        }

    return {
        "filename": filename,
        "insights": generate_insights(filepath)
    }


# ===================================================
# Sources
# ===================================================

@app.post("/sources")
def sources(data: ChatRequest):
    return get_sources(data.message)


# ===================================================
# Debug
# ===================================================

@app.get("/debug")
def debug():
    return {
        "documents_in_chroma": collection.count()
    }


# ===================================================
# Chat
# ===================================================

@app.post("/chat")
def chat(data: ChatRequest):

    try:

        print("\n==========================")
        print("NEW CHAT")
        print("==========================")
        print(f"Question: {data.message}")

        # -----------------------------------------
        # Conversation History
        # -----------------------------------------

        history = get_history_text()

        # -----------------------------------------
        # Retrieve Relevant Documents
        # -----------------------------------------

        grouped_docs = search_documents(data.message)

        context = ""
        sources_used = []

        if grouped_docs:

            print(f"Found {len(grouped_docs)} relevant document(s).")

            for source, chunks in grouped_docs.items():

                sources_used.append(source)

                context += f"\n========================\n"
                context += f"DOCUMENT: {source}\n"
                context += "========================\n\n"

                for chunk in chunks:

                    context += (
                        f"Page: {chunk['page']}\n"
                        f"Similarity: {chunk['score']}\n\n"
                        f"{chunk['text']}\n\n"
                        "----------------------------------------\n"
                    )

            document_instruction = """
The uploaded documents contain relevant information.

Use them FIRST.

If several uploaded documents help,
combine them into one answer.

Mention document names naturally.

If the documents do not fully answer,
continue using your own knowledge.
"""

        else:

            print("No relevant documents found.")

            context = "No relevant uploaded documents."

            document_instruction = """
No uploaded documents are relevant.

Answer naturally using your own knowledge.
"""

        # -----------------------------------------
        # Prompt
        # -----------------------------------------

        prompt = f"""
You are Expert Knowledge Copilot.

You are an expert AI assistant.

You have access to:

1. Conversation History
2. Uploaded Documents
3. Your own knowledge

Rules:

- Behave like ChatGPT.
- Understand follow-up questions.
- Remember previous conversation.
- Use uploaded documents whenever they help.
- Combine multiple uploaded documents whenever appropriate.
- Never invent document facts.
- If documents are incomplete, continue with your own knowledge.
- Keep answers professional and easy to understand.

Conversation History:

{history}

------------------------------------------------

{document_instruction}

------------------------------------------------

Retrieved Documents:

{context}

------------------------------------------------

Current User Question:

{data.message}

Assistant:
"""
       

        # -----------------------------------------
        # Ask Groq
        # -----------------------------------------

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
You are Expert Knowledge Copilot.

Behave exactly like ChatGPT.

Always understand follow-up questions.

Remember previous conversation.

Use uploaded documents whenever relevant.

If uploaded documents are insufficient,
continue using your own knowledge.

Never hallucinate document facts.

Give professional, conversational answers.
"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4,
            max_tokens=1200,
        )

        answer = completion.choices[0].message.content

        # -----------------------------------------
        # Sources
        # -----------------------------------------

        citations = get_sources(data.message)

        if citations:

            answer += "\n\n---\n### Sources\n"

            for source in citations:

                answer += (
                    f"\n📄 {source['document']}"
                    f"\nPages: {', '.join(map(str, source['pages']))}"
                    f"\nConfidence: {source['confidence']}%\n"
                )

        # -----------------------------------------
        # Uploaded Documents Used
        # -----------------------------------------

        if sources_used:

            answer += "\n\n---\n### Uploaded Documents Used\n"

            for src in sorted(set(sources_used)):
                answer += f"\n• {src}"

        # -----------------------------------------
        # Save Conversation Memory
        # -----------------------------------------

        add_user_message(data.message)
        add_assistant_message(answer)

        print("\n==========================")
        print("ANSWER")
        print("==========================")
        print(answer)

        return {
            "answer": answer
        }

    except Exception as e:

        print("\n==========================")
        print("ERROR")
        print("==========================")
        print(type(e).__name__)
        print(str(e))

        return {
            "error": str(e)
        }
