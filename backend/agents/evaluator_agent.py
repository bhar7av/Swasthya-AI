"""
Self-Evaluation Agent
The AI evaluates its own combined response for reliability and consistency.
This is the unique self-improvement mechanism of SwasthyaAI.
"""

import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def self_evaluate(full_analysis: dict) -> dict:
    """AI self-evaluates the combined analysis for reliability."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are a medical AI self-evaluation agent. Your job is to critically review the combined analysis from other AI agents and assess its reliability.

Review this complete analysis and return a JSON object:
{{
  "reliabilityScore": 78,
  "consistencyCheck": true,
  "potentialBiases": ["list any potential biases or gaps"],
  "notes": "Detailed assessment of the analysis quality, consistency between agents, and areas where the user should seek professional verification."
}}

Rules:
- reliabilityScore: 0-100 (be honest — most AI medical analysis should be 60-85)
- Check if severity matches the conditions identified
- Check if first aid steps are appropriate for the severity level
- Check if doctor specialty matches the conditions
- Note any contradictions between agents
- Always remind that AI analysis is supplementary to professional medical advice

Full analysis to evaluate:
{json.dumps(full_analysis, indent=2)}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text

        json_start = result_text.find("{")
        json_end = result_text.rfind("}") + 1
        if json_start != -1 and json_end > json_start:
            result = json.loads(result_text[json_start:json_end])
            # Ensure score is valid
            score = result.get("reliabilityScore", 70)
            if not isinstance(score, (int, float)) or score < 0 or score > 100:
                result["reliabilityScore"] = 70
            return result

        return {"reliabilityScore": 70, "consistencyCheck": True, "potentialBiases": [], "notes": result_text}

    except Exception as e:
        return {
            "reliabilityScore": 65,
            "consistencyCheck": False,
            "potentialBiases": ["Unable to complete full evaluation"],
            "notes": f"Self-evaluation encountered an issue. Please consult a healthcare professional for verification. ({str(e)})",
        }
