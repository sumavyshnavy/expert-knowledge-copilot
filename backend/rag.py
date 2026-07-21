import os
import fitz
import chromadb

from sentence_transformers import SentenceTransformer
from knowledge_graph import extract_entities

# =====================================================
# Chroma Database
# =====================================================

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="knowledge_base"
)

# =====================================================
# Embedding Model
# =====================================================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# =====================================================
# Read PDF Page by Page
# =====================================================

def extract_pages(pdf_path):

    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document):

        text = page.get_text().strip()

        if text:

            pages.append({
                "page": page_number + 1,
                "text": text
            })

    document.close()

    return pages


# =====================================================
# Split Text into Chunks
# =====================================================

def chunk_text(text, chunk_size=300):

    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):

        chunks.append(
            " ".join(words[i:i + chunk_size])
        )

    return chunks


# =====================================================
# Add Document
# =====================================================

def add_document(pdf_path):

    pages = extract_pages(pdf_path)

    all_chunks = []
    metadatas = []

    for page in pages:

        chunks = chunk_text(page["text"])

        for chunk in chunks:

            all_chunks.append(chunk)

            metadatas.append({
                "source": os.path.basename(pdf_path),
                "page": page["page"]
            })

    if not all_chunks:
        return 0

    embeddings = embedding_model.encode(
        all_chunks
    ).tolist()

    ids = [
        f"{os.path.basename(pdf_path)}_{i}"
        for i in range(len(all_chunks))
    ]

    # Remove previous version

    try:
        collection.delete(ids=ids)
    except:
        pass

    collection.add(
        ids=ids,
        documents=all_chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    try:

        extract_entities(
            "\n".join(all_chunks),
            os.path.basename(pdf_path)
        )

    except Exception as e:

        print("Knowledge Graph Error:", e)

    return len(all_chunks)


# =====================================================
# Search
# =====================================================

def search_documents(query, k=5):

    if collection.count() == 0:
        return {}

    query_embedding = embedding_model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    print("\n===== SEARCH DEBUG =====")
    print("Documents:", documents)
    print("Metadata:", metadatas)
    print("Distances:", distances)
    print("========================\n")

    grouped = {}

    for doc, meta, distance in zip(
        documents,
        metadatas,
        distances
    ):

        source = meta.get("source", "Unknown Document")
        page = meta.get("page", 1)

        if source not in grouped:
            grouped[source] = []

        grouped[source].append({
            "page": page,
            "score": round(distance, 3),
            "text": doc
        })

    # Lower distance = better match

    for source in grouped:

        grouped[source] = sorted(
            grouped[source],
            key=lambda x: x["score"]
        )[:3]

    return grouped