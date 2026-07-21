from rag import collection


def get_stats():

    return {
        "documents": collection.count(),
        "chunks": collection.count()
    }