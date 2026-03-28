"""
First Aid Support Agent
Generates step-by-step first aid and self-care guidance.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def generate_first_aid(symptoms: dict, conditions: list, severity: dict) -> dict:
    """Generate first aid steps based on symptoms, conditions, and severity."""
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""You are a first aid and immediate care guidance agent. Generate practical, safe first aid steps.

Return a JSON object with this exact structure:
{{
  "steps": [
    "Step 1: Clear, actionable instruction",
    "Step 2: Another instruction",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ..."
  ],
  "warnings": ["any important warnings or contraindications"]
}}

Rules:
- Provide exactly 5 steps
- Steps must be safe, practical, and immediately actionable at home
- For critical severity, the first step should always be "Call emergency services"
- Include specific measurements, durations, and dosages where safe to do so
- Never recommend prescription medications
- Always include a step about monitoring and when to seek professional help

Symptoms: {json.dumps(symptoms, indent=2)}
Conditions: {json.dumps(conditions, indent=2)}
Severity: {json.dumps(severity, indent=2)}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(result_text[json_start:json_end])

        return {"steps": [result_text], "warnings": []}

    except Exception as e:
        return {
            "steps": [
                "Rest and stay hydrated.",
                "Monitor your symptoms carefully.",
                "Take over-the-counter pain relief if needed.",
                "Avoid strenuous activity.",
                f"Consult a healthcare professional. (Note: {str(e)})",
            ],
            "warnings": [],
        }
