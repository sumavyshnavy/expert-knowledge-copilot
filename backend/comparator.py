import os

from dotenv import load_dotenv
from groq import Groq

from rag import extract_pages

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def compare_documents(file1, file2):

    pages1 = extract_pages(file1)
    pages2 = extract_pages(file2)

    text1 = "\n".join([p["text"] for p in pages1])[:7000]
    text2 = "\n".join([p["text"] for p in pages2])[:7000]

    prompt = f"""
Compare these two documents.

Return:

# Overview

# Similarities

# Differences

# Important Topics

# Which document is more detailed?

# Final Conclusion

--------------------

DOCUMENT 1

{text1}

--------------------

DOCUMENT 2

{text2}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=1200
    )

    return completion.choices[0].message.content