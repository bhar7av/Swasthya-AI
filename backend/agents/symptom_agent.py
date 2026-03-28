"""
Symptom Extraction Agent
Extracts structured symptoms from user text and/or image using Google Gemini.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def extract_symptoms(text: str = "", image_data: bytes = None, image_mime: str = None) -> dict:
    """Extract structured symptoms from text and/or image input."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = """You are a medical symptom extraction agent. Analyze the patient's input and extract all symptoms mentioned.

Return a JSON object with this exact structure:
{
  "symptoms": [
    {
      "name": "symptom name",
      "bodyArea": "body area affected",
      "duration": "how long (if mentioned)",
      "intensity": "mild/moderate/severe (if determinable)"
    }
  ],
  "additionalObservations": "any other relevant observations from the input"
}

Patient input: """ + (text or "See attached image for visual symptoms.")

    try:
        content_parts = [prompt]
        if image_data and image_mime:
            content_parts.append({
                "mime_type": image_mime,
                "data": image_data,
            })

        response = model.generate_content(content_parts)
        result_text = response.text

        # Parse JSON from response
        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(result_text[json_start:json_end])

        return {"symptoms": [], "additionalObservations": result_text}

    except Exception as e:
        return {
            "symptoms": [{"name": text or "visual symptom", "bodyArea": "unknown", "duration": "unknown", "intensity": "unknown"}],
            "additionalObservations": f"Agent encountered an issue: {str(e)}",
        }
