import os

from dotenv import load_dotenv
from groq import Groq

from rag import extract_pages

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_insights(filepath):

    pages = extract_pages(filepath)

    text = ""

    for page in pages:
        text += page["text"] + "\n"

    text = text[:12000]

    prompt = f"""
You are an expert industrial AI analyst.

Analyze this document.

Return the answer in Markdown.

# Executive Summary

# Key Insights

# Important Technologies

# Key Entities

# Risks

# Recommendations

# Action Items

# Frequently Asked Questions

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
        max_tokens=1200
    )

    return completion.choices[0].message.content