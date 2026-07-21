import os

from groq import Groq
from dotenv import load_dotenv

from rag import extract_pages

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def summarize_document(filepath):

    pages = extract_pages(filepath)

    text = ""

    for page in pages:
        text += page["text"] + "\n"

    text = text[:12000]

    prompt = f"""
You are an expert document analyst.

Read the document and produce the following:

# Executive Summary

# Key Topics

# Important Facts

# Technologies Mentioned

# Risks or Warnings

# Five Suggested Questions someone could ask about this document.

Document:

{text}
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
        max_tokens=900,
    )

    return completion.choices[0].message.content