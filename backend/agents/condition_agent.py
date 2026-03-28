"""
Condition Analysis Agent
Predicts possible medical conditions based on extracted symptoms.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def analyze_conditions(symptoms: dict) -> list:
    """Analyze symptoms and predict possible conditions with confidence scores."""
    model = genai.GenerativeModel("gemini-2.0-flash")

    symptoms_text = json.dumps(symptoms, indent=2)

    prompt = f"""You are a medical condition analysis agent. Based on the extracted symptoms, predict the top 3 most likely conditions.

Return a JSON array with this exact structure:
[
  {{
    "name": "condition name",
    "confidence": 75,
    "description": "brief description of the condition and why it matches"
  }}
]

Rules:
- Confidence should be 0-100 as an integer
- Order by confidence (highest first)
- Be medically accurate but accessible to non-medical users
- Always include a disclaimer that this is AI-generated guidance

Extracted symptoms:
{symptoms_text}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("[")
        json_end = result_text.rfind("]") + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(result_text[json_start:json_end])

        return [{"name": "Analysis Pending", "confidence": 50, "description": result_text}]

    except Exception as e:
        return [{"name": "Analysis Error", "confidence": 0, "description": str(e)}]
