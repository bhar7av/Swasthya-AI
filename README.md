#Deployed on :- https://swasthya-ai-lyart.vercel.app/


# 🏥 SwasthyaAI — Your AI Health Guardian

> AI-powered health assistant that analyzes symptoms, detects severity, and provides instant medical guidance using autonomous AI agents.

![SwasthyaAI](https://img.shields.io/badge/SwasthyaAI-AI%20Health%20Guardian-06d6a0?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285f4?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge)

## ✨ Features

### 🔬 Multi-Modal Input
- **Text analysis** — Describe your symptoms naturally
- **Image analysis** — Upload photos of skin conditions, injuries, or wounds

### 🤖 7 Autonomous AI Agents
| Agent | Role |
|-------|------|
| 🔍 Symptom Agent | Extracts structured symptoms from text/images |
| 🧬 Condition Agent | Predicts top 3 possible conditions with confidence % |
| ⚠️ Severity Agent | Rates urgency (safe → attention → critical) on 1-10 scale |
| 🧠 Mental Agent | Detects stress, anxiety, depression indicators |
| 🩹 Support Agent | Generates 5-step first aid guidance |
| 👨‍⚕️ Doctor Agent | Recommends specialist + Google Maps link |
| ✅ Evaluator Agent | **Self-evaluation** — AI grades its own reliability |

### 🧠 Mental Health Support
- Conversational chat with empathetic AI companion
- **Box breathing exercise** (4-4-4-4 technique) with animated guide
- Indian mental health helpline numbers included

### 🎨 Stunning UI
- Dark-mode glassmorphic design
- Animated severity gauge
- Floating medical particle background
- Typewriter hero animation
- Heartbeat SVG trace

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)
- **Google Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd SwasthyaAI
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
Visit **http://localhost:5173** 🎉

---

## 🏗️ Architecture

```
SwasthyaAI/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParticleBackground.jsx  # Floating medical particles
│   │   │   ├── Navbar.jsx              # Glassmorphic navigation
│   │   │   ├── HeroSection.jsx         # Animated hero + typewriter
│   │   │   ├── SymptomInput.jsx        # Multi-modal input + loading
│   │   │   ├── ResultsDashboard.jsx    # Severity gauge + results
│   │   │   └── MentalHealthChat.jsx    # Chat + breathing exercise
│   │   ├── App.jsx                     # Root + routing + API
│   │   ├── index.css                   # Full design system
│   │   └── main.jsx                    # Entry point
│   └── index.html
│
├── backend/                     # FastAPI + Google Gemini
│   ├── agents/
│   │   ├── symptom_agent.py     # Stage 1: Extract symptoms
│   │   ├── condition_agent.py   # Stage 2a: Predict conditions
│   │   ├── mental_agent.py      # Stage 2b: Mental health eval
│   │   ├── severity_agent.py    # Stage 3a: Severity assessment
│   │   ├── doctor_agent.py      # Stage 3b: Doctor recommendation
│   │   ├── support_agent.py     # Stage 4: First aid guidance
│   │   └── evaluator_agent.py   # Stage 5: Self-evaluation
│   ├── routes/
│   │   ├── analyze.py           # POST /api/analyze (orchestrator)
│   │   └── mental_chat.py       # POST /api/mental-chat
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt
│   └── .env                     # GEMINI_API_KEY
└── README.md
```

### Agent Pipeline Flow
```
User Input (text + image)
    │
    ▼
🔍 Symptom Extraction
    │
    ├──────────────────┐
    ▼                  ▼
🧬 Conditions     🧠 Mental Health
    │                  │
    ├──────────────────┤
    ▼                  ▼
⚠️ Severity       👨‍⚕️ Doctor
    │                  │
    └──────────────────┘
           │
           ▼
    🩹 First Aid
           │
           ▼
    ✅ Self-Evaluation
           │
           ▼
    📊 Final Response
```

---

## ⚠️ Disclaimer

> SwasthyaAI is an AI-assisted tool and **not a substitute for professional medical advice**. Always consult a qualified healthcare provider for medical concerns.

---

## 🏆 Built for Hackathon

Made with 💜 by Team SwasthyaAI — enabling faster, safer, and more informed health decisions.
# Swasthya-AI
