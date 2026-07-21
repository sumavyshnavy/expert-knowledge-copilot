from rag import search_documents


def get_sources(question):

    grouped = search_documents(question)

    sources = []

    for source, chunks in grouped.items():

        pages = sorted(
            list(
                set(
                    chunk["page"]
                    for chunk in chunks
                )
            )
        )

        best_distance = min(
            chunk["score"]
            for chunk in chunks
        )

        # Convert distance to confidence (0-100%)
        confidence = round(
            max(
                0,
                min(
                    100,
                    (1/ (1 + best_distance)) * 100
                )
            )
        )

        sources.append(
            {
                "document": source,
                "pages": pages,
                "confidence": confidence
            }
        )

    return sources