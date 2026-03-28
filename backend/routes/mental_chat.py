"""
Mental Health Chat Route
Provides a conversational mental health support endpoint.
"""

import os
import json
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()


class ChatMessage(BaseModel):
    message: str


@router.post("/mental-chat")
async def mental_chat(msg: ChatMessage):
    """
    Conversational mental health support using Gemini.
    Provides empathetic, supportive responses.
    """
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""You are a warm, empathetic mental health support companion called SwasthyaAI.

Rules:
- Be compassionate, non-judgmental, and supportive
- Never diagnose mental health conditions
- Suggest practical coping techniques (breathing, grounding, journaling)
- If the user seems in crisis, gently encourage them to reach out to a professional or helpline
- Keep responses concise (2-4 sentences) but warm
- Use gentle emojis occasionally (💜, 🌟, 🫂)
- If asked about physical symptoms, suggest using the health analysis feature instead

Indian Mental Health Helplines:
- iCall: 9152987821
- Vandrevala Foundation: 1860-2662-345
- NIMHANS: 080-46110007

User message: "{msg.message}"

Respond naturally and supportively:"""

    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        return {
            "response": "I hear you, and I'm glad you're reaching out. While I'm having a small technical moment, please know that you're not alone. If you need immediate support, consider calling iCall at 9152987821. 💜"
        }
