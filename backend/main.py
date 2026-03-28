from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.analyze import router as analyze_router
from routes.mental_chat import router as mental_router

load_dotenv()

app = FastAPI(
    title="SwasthyaAI Backend",
    description="AI-powered health analysis with autonomous agent pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")
app.include_router(mental_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "SwasthyaAI Backend",
        "agents": [
            "symptom_agent",
            "condition_agent",
            "severity_agent",
            "mental_agent",
            "support_agent",
            "doctor_agent",
            "evaluator_agent",
        ],
    }
