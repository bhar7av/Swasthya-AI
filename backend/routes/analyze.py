"""
Analyze Route — The Orchestrator
Runs the full 7-agent pipeline:
  1. Symptom Extraction
  2. Condition Analysis + Mental Health (parallel)
  3. Severity Assessment + Doctor Recommendation (parallel)
  4. First Aid Generation
  5. Self-Evaluation
"""

import asyncio
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional

from agents.symptom_agent import extract_symptoms
from agents.condition_agent import analyze_conditions
from agents.severity_agent import assess_severity
from agents.mental_agent import evaluate_mental_health
from agents.support_agent import generate_first_aid
from agents.doctor_agent import recommend_doctor
from agents.evaluator_agent import self_evaluate

router = APIRouter()


@router.post("/analyze")
async def analyze_health(
    text: str = Form(default=""),
    image: Optional[UploadFile] = File(default=None),
):
    """
    Main analysis endpoint.
    Accepts symptom text and/or an image.
    Runs the full autonomous agent pipeline and returns comprehensive results.
    """

    # Read image if provided
    image_data = None
    image_mime = None
    if image:
        image_data = await image.read()
        image_mime = image.content_type

    # ─── Stage 1: Symptom Extraction ─────────────────────────
    symptoms = await extract_symptoms(text, image_data, image_mime)

    # ─── Stage 2: Parallel — Conditions + Mental Health ──────
    conditions_task = analyze_conditions(symptoms)
    mental_task = evaluate_mental_health(text, symptoms)
    conditions, mental_health = await asyncio.gather(conditions_task, mental_task)

    # ─── Stage 3: Parallel — Severity + Doctor ───────────────
    severity_task = assess_severity(symptoms, conditions)
    doctor_task = recommend_doctor(conditions, {"level": "attention", "urgencyScore": 5})
    severity, doctor = await asyncio.gather(severity_task, doctor_task)

    # Update doctor recommendation with actual severity
    if severity.get("level") == "critical":
        doctor = await recommend_doctor(conditions, severity)

    # ─── Stage 4: First Aid ──────────────────────────────────
    first_aid = await generate_first_aid(symptoms, conditions, severity)

    # ─── Stage 5: Self-Evaluation ────────────────────────────
    full_analysis = {
        "symptoms": symptoms,
        "conditions": conditions,
        "severity": severity,
        "mentalHealth": mental_health,
        "firstAid": first_aid,
        "doctor": doctor,
    }
    self_eval = await self_evaluate(full_analysis)

    # ─── Final Response ──────────────────────────────────────
    return {
        "severity": severity,
        "conditions": conditions,
        "firstAid": first_aid,
        "doctor": doctor,
        "mentalHealth": mental_health,
        "selfEvaluation": self_eval,
        "extractedSymptoms": symptoms,
    }
