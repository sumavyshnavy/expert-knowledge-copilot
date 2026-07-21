import os

UPLOAD_FOLDER = "uploads"


def get_documents():

    documents = []

    if not os.path.exists(UPLOAD_FOLDER):
        return documents

    for filename in os.listdir(UPLOAD_FOLDER):

        if filename.endswith(".pdf"):

            path = os.path.join(
                UPLOAD_FOLDER,
                filename
            )

            size = os.path.getsize(path)

            documents.append({
                "filename": filename,
                "size": f"{round(size / 1024, 1)} KB"
            })

    return documents