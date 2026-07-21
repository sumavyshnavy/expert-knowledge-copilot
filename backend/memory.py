from collections import deque

# Store the last 20 messages
MAX_MESSAGES = 20

conversation_history = deque(maxlen=MAX_MESSAGES)


def add_user_message(message: str):
    conversation_history.append({
        "role": "user",
        "content": message
    })


def add_assistant_message(message: str):
    conversation_history.append({
        "role": "assistant",
        "content": message
    })


def get_history():
    return list(conversation_history)


def get_history_text():

    text = ""

    for msg in conversation_history:

        if msg["role"] == "user":
            text += f"User: {msg['content']}\n"

        else:
            text += f"Assistant: {msg['content']}\n"

    return text


def clear_history():
    conversation_history.clear()