import os
import re
import fitz
import networkx as nx

UPLOAD_FOLDER = "uploads"

# =====================================================
# Graph
# =====================================================

GRAPH = nx.Graph()

# =====================================================
# Stop Words
# =====================================================

STOP_WORDS = {
    "this", "that", "with", "from", "have", "will",
    "their", "there", "about", "which", "where",
    "using", "used", "been", "into", "between",
    "also", "more", "than", "when", "what",
    "your", "they", "them", "would", "should",
    "could", "these", "those", "very", "such",
    "page", "document", "figure", "table",
    "manual", "section", "chapter", "shall",
    "must", "into", "upon", "after", "before"
}

# =====================================================
# Clean Word
# =====================================================

def clean_word(word):

    word = re.sub(r"[^A-Za-z0-9]", "", word)

    return word.strip().lower()

# =====================================================
# Extract Keywords
# =====================================================

def extract_keywords(text):

    words = []

    for word in text.split():

        word = clean_word(word)

        if len(word) < 5:
            continue

        if word in STOP_WORDS:
            continue

        if word.isdigit():
            continue

        words.append(word)

    frequency = {}

    for word in words:
        frequency[word] = frequency.get(word, 0) + 1

    keywords = sorted(
        frequency.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [k for k, _ in keywords[:40]]

# =====================================================
# Extract Entities
# =====================================================

def extract_entities(text, document_name):

    keywords = extract_keywords(text)

    GRAPH.add_node(
        document_name,
        type="document"
    )

    # Document -> Keyword
    for keyword in keywords:

        GRAPH.add_node(
            keyword,
            type="keyword"
        )

        GRAPH.add_edge(
            document_name,
            keyword,
            relation="contains"
        )

    # Keyword -> Keyword
    for i in range(len(keywords)):

        for j in range(i + 1, min(i + 6, len(keywords))):

            if keywords[i] != keywords[j]:

                GRAPH.add_edge(
                    keywords[i],
                    keywords[j],
                    relation="related"
                )

# =====================================================
# Build Graph From Upload Folder
# =====================================================

def rebuild_graph():

    GRAPH.clear()

    if not os.path.exists(UPLOAD_FOLDER):
        return

    for filename in os.listdir(UPLOAD_FOLDER):

        if not filename.lower().endswith(".pdf"):
            continue

        path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        try:

            pdf = fitz.open(path)

            text = ""

            for page in pdf:
                text += page.get_text()

            pdf.close()

            extract_entities(
                text,
                filename
            )

        except Exception as e:

            print(e)

# =====================================================
# API Response
# =====================================================

def get_graph():

    rebuild_graph()

    nodes = []

    edges = []

    for node, data in GRAPH.nodes(data=True):

        nodes.append({

            "id": node,
            "label": node,
            "type": data.get(
                "type",
                "keyword"
            )
        })

    for source, target, data in GRAPH.edges(data=True):

        edges.append({

            "source": source,
            "target": target,
            "label": data.get(
                "relation",
                "related"
            )
        })

    return {

        "nodes": nodes,
        "edges": edges
    }