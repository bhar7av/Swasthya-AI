"""
Severity Assessment Agent
Evaluates the severity/urgency of the patient's condition.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def assess_severity(symptoms: dict, conditions: list) -> dict:
    """Assess severity level and urgency score for the given symptoms and conditions."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are a medical severity assessment agent. Evaluate the urgency of the patient's situation.

Return a JSON object with this exact structure:
{{
  "level": "safe|attention|critical",
  "urgencyScore": 5,
  "reasoning": "explanation of why this severity level was assigned"
}}

Rules:
- level must be exactly one of: "safe", "attention", "critical"
- urgencyScore is 1-10 (1=routine, 5=needs attention, 10=emergency)
- "safe" = 1-3, "attention" = 4-6, "critical" = 7-10
- Be conservative: when in doubt, rate higher severity
- Always recommend professional consultation for anything above "safe"

Symptoms: {json.dumps(symptoms, indent=2)}
Predicted conditions: {json.dumps(conditions, indent=2)}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            result = json.loads(result_text[json_start:json_end])
            # Ensure valid level
            if result.get("level") not in ("safe", "attention", "critical"):
                result["level"] = "attention"
            return result

        return {"level": "attention", "urgencyScore": 5, "reasoning": result_text}

    except Exception as e:
        return {"level": "attention", "urgencyScore": 5, "reasoning": f"Error in assessment: {str(e)}"}
