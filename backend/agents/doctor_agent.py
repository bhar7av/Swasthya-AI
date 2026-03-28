"""
Doctor Recommendation Agent
Recommends a doctor specialty and generates a Google Maps search URL.
"""

import os
import json
import urllib.parse
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def recommend_doctor(conditions: list, severity: dict) -> dict:
    """Recommend a doctor specialty based on conditions and severity."""
    model = genai.GenerativeModel("gemini-2.0-flash-lite")

    prompt = f"""You are a medical referral agent. Recommend the most appropriate doctor specialty.

Return a JSON object with this exact structure:
{{
  "specialty": "Doctor specialty name",
  "reason": "Brief explanation of why this specialist is recommended",
  "searchTerm": "search term for finding this doctor on Google Maps"
}}

Rules:
- For critical cases, recommend Emergency Medicine / ER
- Be specific about the specialty (e.g., "Neurologist" not just "specialist")
- The searchTerm should be optimized for Google Maps search

Conditions: {json.dumps(conditions, indent=2)}
Severity: {json.dumps(severity, indent=2)}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            result = json.loads(result_text[json_start:json_end])
            search_term = result.get("searchTerm", result.get("specialty", "doctor"))
            result["mapsUrl"] = f"https://www.google.com/maps/search/{urllib.parse.quote(search_term + ' near me')}"
            return result

        return {
            "specialty": "General Physician",
            "reason": result_text,
            "mapsUrl": "https://www.google.com/maps/search/doctor+near+me",
        }

    except Exception as e:
        return {
            "specialty": "General Physician",
            "reason": f"A general check-up is recommended. (Error: {str(e)})",
            "mapsUrl": "https://www.google.com/maps/search/doctor+near+me",
        }
