"""
Mental Health Agent
Detects stress, anxiety, or depression indicators from patient input.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def evaluate_mental_health(original_text: str, symptoms: dict) -> dict:
    """Evaluate the patient's mental health state from their input."""
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""You are a compassionate mental health evaluation agent. Analyze the patient's text for mental health indicators.

Return a JSON object with this exact structure:
{{
  "state": "descriptive state (e.g., 'Stable', 'Mildly Stressed', 'Anxious', 'Showing signs of distress')",
  "indicators": ["list", "of", "detected", "indicators"],
  "message": "A warm, supportive message for the patient. Be empathetic and encouraging."
}}

Rules:
- Be gentle and non-judgmental
- Look for: anxiety, stress, panic, depression, overwhelm, fear, frustration
- The message should be supportive and actionable
- If no mental health concerns detected, still provide a positive, encouraging message
- Never diagnose — you are providing supportive guidance only

Patient's original text: "{original_text}"
Extracted symptoms: {json.dumps(symptoms, indent=2)}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(result_text[json_start:json_end])

        return {"state": "Stable", "indicators": [], "message": result_text}

    except Exception as e:
        return {
            "state": "Unable to assess",
            "indicators": [],
            "message": f"We're here for you. Please reach out to a mental health professional if you need support. (Error: {str(e)})",
        }
