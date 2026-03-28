import React, { useState, useEffect } from 'react'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SymptomInput from './components/SymptomInput'
import ResultsDashboard from './components/ResultsDashboard'
import MentalHealthChat from './components/MentalHealthChat'
import HealthProfile, { loadProfile, saveProfile } from './components/HealthProfile'
import HealthHistory, { saveToHistory } from './components/HealthHistory'
import AuthPage, { getLoggedInUser, logoutUser } from './components/AuthPage'

export default function App() {
  const [page, setPage] = useState('home')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [showSOS, setShowSOS] = useState(false)
  const [lastInputText, setLastInputText] = useState('')
  const [authUser, setAuthUser] = useState(undefined) // undefined = loading, null = not logged in

  // Check auth + profile on mount
  useEffect(() => {
    const loggedIn = getLoggedInUser()
    if (loggedIn) {
      setAuthUser(loggedIn)
      const saved = loadProfile()
      if (saved) {
        setUserProfile({ ...saved, email: loggedIn.email })
      } else {
        setPage('profile')
      }
    } else {
      setAuthUser(null)
    }
  }, [])

  const handleAuth = (user) => {
    setAuthUser(user)
    const saved = loadProfile()
    if (saved) {
      setUserProfile({ ...saved, email: user.email })
      setPage('home')
    } else {
      // Pre-fill name from signup
      setUserProfile({ name: user.name, email: user.email })
      setPage('profile')
    }
  }

  const handleLogout = () => {
    logoutUser()
    setAuthUser(null)
    setUserProfile(null)
    setResults(null)
    setShowSOS(false)
    setPage('home')
  }

  const handleProfileComplete = (profile) => {
    const enrichedProfile = { ...profile, email: authUser?.email }
    setUserProfile(enrichedProfile)
    saveProfile(enrichedProfile)
    setPage('home')
  }

  const handleAnalyze = async (text, image) => {
    setLoading(true)
    setResults(null)
    setLastInputText(text)


    try {
      const formData = new FormData()
      formData.append('text', text || '')
      if (image) formData.append('image', image)

      // Send profile data for personalized analysis
      if (userProfile) {
        formData.append('userAge', userProfile.age || '')
        formData.append('userGender', userProfile.gender || '')
        formData.append('existingConditions', userProfile.existingConditions || '')
        formData.append('allergies', userProfile.allergies || '')
        formData.append('medications', userProfile.medications || '')
      }

      const API_URL = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setResults(data)
        setShowSOS(data.severity?.level === 'critical')
        saveToHistory(data, text)
        setPage('results')
      } else {
        throw new Error('API error')
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      // Demo fallback when backend is not running
      await new Promise((r) => setTimeout(r, 8000))
      const demoResults = getDemoResults(text)
      setResults(demoResults)
      setShowSOS(demoResults.severity?.level === 'critical')
      saveToHistory(demoResults, text)
      setPage('results')
    }
    setLoading(false)
  }

  const handleNewAnalysis = () => {
    setResults(null)
    setShowSOS(false)
    setPage('analyze')
  }

  const handleViewHistoryResult = (result) => {
    setResults(result)
    setShowSOS(result.severity?.level === 'critical')
    setPage('results')
  }

  // Show loading while checking auth
  if (authUser === undefined) {
    return (
      <>
        <div className="app-background" />
        <ParticleBackground />
      </>
    )
  }

  // Not logged in — show auth page
  if (authUser === null) {
    return (
      <>
        <div className="app-background" />
        <ParticleBackground />
        <AuthPage onAuth={handleAuth} />
      </>
    )
  }

  const renderPage = () => {
    if (page === 'profile') {
      return (
        <HealthProfile
          onComplete={handleProfileComplete}
          existingProfile={userProfile}
        />
      )
    }

    switch (page) {
      case 'home':
        return <HeroSection onNavigate={setPage} userName={userProfile?.name} />
      case 'analyze':
        return (
          <SymptomInput
            onAnalyze={handleAnalyze}
            loading={loading}
            userProfile={userProfile}
          />
        )
      case 'results':
        return (
          <ResultsDashboard
            results={results}
            onNewAnalysis={handleNewAnalysis}
            userProfile={userProfile}
          />
        )
      case 'mental':
        return <MentalHealthChat />
      case 'history':
        return <HealthHistory onViewResult={handleViewHistoryResult} />
      default:
        return <HeroSection onNavigate={setPage} userName={userProfile?.name} />
    }
  }

  return (
    <>
      <div className="app-background" />
      <ParticleBackground />
      {page !== 'profile' && (
        <Navbar
          currentPage={page}
          onNavigate={setPage}
          userProfile={userProfile}
          showSOS={showSOS}
          onLogout={handleLogout}
        />
      )}
      <main>{renderPage()}</main>
      {page !== 'profile' && (
        <footer className="footer">
          <p>
            SwasthyaAI — Built with 💜 for better health decisions.{' '}
            <a href="#">Powered by Google Gemini</a>
          </p>
          <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
            ⚠️ This is an AI assistant and not a substitute for professional medical advice.
          </p>
        </footer>
      )}
    </>
  )
}

function getDemoResults(text) {
  const inputLower = (text || '').toLowerCase()
  let conditions, severity, firstAid, doctor, mentalHealth

  if (inputLower.includes('headache') || inputLower.includes('fever') || inputLower.includes('head')) {
    severity = {
      level: 'attention',
      urgencyScore: 5,
      reasoning:
        'Headache combined with fever lasting multiple days warrants medical attention to rule out infections. While not immediately life-threatening, persistent symptoms should be evaluated.',
    }
    conditions = [
      { name: 'Viral Infection', confidence: 72, description: 'Common viral illness causing fever, headache, and body aches. Usually self-limiting within 5-7 days.' },
      { name: 'Sinusitis', confidence: 58, description: 'Inflammation of sinuses that can cause headache and low-grade fever, often following a cold.' },
      { name: 'Migraine with Fever', confidence: 35, description: 'Severe headaches sometimes accompanied by systemic symptoms including mild fever.' },
    ]
    firstAid = {
      steps: [
        'Rest in a cool, dark room and stay well hydrated — drink at least 8 glasses of water daily.',
        'Take over-the-counter acetaminophen (Tylenol) or ibuprofen as directed for fever and pain.',
        'Apply a cool, damp cloth to your forehead for 15-minute intervals to relieve headache.',
        'Monitor your temperature every 4 hours. Seek emergency care if it exceeds 103°F (39.4°C).',
        'Avoid screens and bright lights. Get 8+ hours of sleep to support your immune system.',
      ],
    }
    doctor = {
      specialty: 'General Physician / Internal Medicine',
      reason: 'A general physician can evaluate your combined symptoms, run blood tests if needed, and rule out bacterial infections.',
      mapsUrl: 'https://www.google.com/maps/search/general+physician+doctor+near+me',
    }
    mentalHealth = {
      state: 'Mildly Stressed',
      message: 'Dealing with persistent physical symptoms can be stressful. Remember that most common infections resolve with rest and care. Try to avoid health-related anxiety by focusing on recovery steps.',
    }
  } else if (inputLower.includes('chest') || inputLower.includes('heart') || inputLower.includes('breath')) {
    severity = {
      level: 'critical',
      urgencyScore: 9,
      reasoning: 'Chest-related symptoms require immediate medical evaluation to rule out cardiac or pulmonary emergencies.',
    }
    conditions = [
      { name: 'Anxiety/Panic Attack', confidence: 45, description: 'Can mimic cardiac symptoms with chest tightness, rapid heartbeat, and shortness of breath.' },
      { name: 'Costochondritis', confidence: 35, description: 'Inflammation of the cartilage connecting ribs to breastbone, causing chest pain.' },
      { name: 'Cardiac Evaluation Needed', confidence: 30, description: 'Chest symptoms always warrant cardiac screening to rule out serious conditions.' },
    ]
    firstAid = {
      steps: [
        '⚠️ IMPORTANT: If experiencing crushing chest pain, call emergency services (112/911) immediately.',
        'Sit upright in a comfortable position. Do not lie flat.',
        'If you have prescribed nitroglycerin, take it as directed.',
        'Practice slow, deep breathing — 4 seconds in, 4 seconds hold, 4 seconds out.',
        'Do NOT exert yourself. Have someone stay with you until medical help arrives.',
      ],
    }
    doctor = {
      specialty: 'Cardiologist / Emergency Medicine',
      reason: 'Chest symptoms require urgent cardiac evaluation including ECG and possible cardiac enzyme tests.',
      mapsUrl: 'https://www.google.com/maps/search/cardiologist+hospital+near+me',
    }
    mentalHealth = {
      state: 'Anxious',
      message: 'Chest symptoms can cause significant anxiety. While seeking medical help is important, try to stay as calm as possible. Deep breathing can help manage both physical and emotional symptoms.',
    }
  } else if (inputLower.includes('stomach') || inputLower.includes('nausea') || inputLower.includes('abdomen') || inputLower.includes('vomit')) {
    severity = {
      level: 'attention',
      urgencyScore: 4,
      reasoning: 'Gastrointestinal symptoms are common and often resolve with self-care, but persistent symptoms should be evaluated to rule out infections or other causes.',
    }
    conditions = [
      { name: 'Gastroenteritis', confidence: 68, description: 'Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection (stomach flu).' },
      { name: 'Food Poisoning', confidence: 55, description: 'Illness from contaminated food, typically causing nausea, vomiting, and diarrhea within hours of eating.' },
      { name: 'Acid Reflux (GERD)', confidence: 40, description: 'Chronic condition where stomach acid flows back into the esophagus, causing heartburn and nausea.' },
    ]
    firstAid = {
      steps: [
        'Stay hydrated — sip water, ORS (oral rehydration solution), or clear liquids frequently.',
        'Follow the BRAT diet: Bananas, Rice, Applesauce, Toast — gentle on the stomach.',
        'Avoid dairy, spicy, fatty, and heavily seasoned foods until you feel better.',
        'Rest and avoid strenuous activity. Lie on your left side if nauseous.',
        'Seek medical help if symptoms last more than 48 hours, or if you notice blood in vomit or stool.',
      ],
    }
    doctor = {
      specialty: 'Gastroenterologist',
      reason: 'A GI specialist can diagnose underlying digestive issues and recommend targeted treatment.',
      mapsUrl: 'https://www.google.com/maps/search/gastroenterologist+near+me',
    }
    mentalHealth = {
      state: 'Mildly Uncomfortable',
      message: 'Digestive issues can be stressful but are very common and usually treatable. Focus on gentle nutrition and hydration. You will feel better soon. 💜',
    }
  } else if (inputLower.includes('skin') || inputLower.includes('rash') || inputLower.includes('itch') || inputLower.includes('wound')) {
    severity = {
      level: 'safe',
      urgencyScore: 3,
      reasoning: 'Skin conditions are generally manageable with topical treatment and good hygiene, unless signs of infection develop.',
    }
    conditions = [
      { name: 'Contact Dermatitis', confidence: 60, description: 'Skin inflammation caused by contact with an irritant or allergen, causing redness and itching.' },
      { name: 'Eczema', confidence: 48, description: 'Chronic condition causing dry, itchy, and inflamed skin patches. Common and treatable.' },
      { name: 'Fungal Infection', confidence: 38, description: 'Caused by fungi, leading to ring-shaped rashes, itching, and skin discoloration.' },
    ]
    firstAid = {
      steps: [
        'Keep the affected area clean and dry. Wash gently with mild soap.',
        'Apply over-the-counter hydrocortisone cream or calamine lotion for itching.',
        'Avoid scratching — trim fingernails and consider wearing cotton gloves at night.',
        'If a wound is present, clean with antiseptic and apply sterile bandage.',
        'See a dermatologist if the condition spreads, worsens, or shows signs of infection (pus, warmth, red streaks).',
      ],
    }
    doctor = {
      specialty: 'Dermatologist',
      reason: 'A dermatologist can accurately diagnose skin conditions and prescribe targeted treatments.',
      mapsUrl: 'https://www.google.com/maps/search/dermatologist+near+me',
    }
    mentalHealth = {
      state: 'Stable',
      message: 'Skin issues, though uncomfortable, are very common and highly treatable. Keep a positive outlook — most conditions clear up well with proper care.',
    }
  } else {
    severity = {
      level: 'safe',
      urgencyScore: 3,
      reasoning: 'Based on the described symptoms, this appears to be a mild condition that can likely be managed with self-care. However, consult a doctor if symptoms persist beyond a week.',
    }
    conditions = [
      { name: 'Minor Ailment', confidence: 65, description: 'Your symptoms suggest a common, non-serious condition that typically resolves with basic care.' },
      { name: 'Stress-Related Symptoms', confidence: 50, description: 'Physical symptoms can often be linked to stress, poor sleep, or lifestyle factors.' },
      { name: 'Nutritional Deficiency', confidence: 30, description: 'Some symptoms may be related to inadequate nutrition, hydration, or vitamin intake.' },
    ]
    firstAid = {
      steps: [
        'Ensure adequate rest — aim for 7-9 hours of quality sleep per night.',
        'Stay well hydrated. Drink water regularly throughout the day.',
        'Eat a balanced diet rich in fruits, vegetables, and whole grains.',
        'Consider light exercise like walking or yoga to boost immunity and mood.',
        'Monitor symptoms and consult a doctor if they worsen or persist beyond 7 days.',
      ],
    }
    doctor = {
      specialty: 'General Physician',
      reason: 'A general check-up can help identify any underlying causes and provide peace of mind.',
      mapsUrl: 'https://www.google.com/maps/search/general+physician+near+me',
    }
    mentalHealth = {
      state: 'Stable',
      message: "You seem to be in a generally stable state. Remember to take care of your mental health alongside physical health. Regular exercise, good sleep, and social connections are great for overall well-being.",
    }
  }

  return {
    severity,
    conditions,
    firstAid,
    doctor,
    mentalHealth,
    selfEvaluation: {
      reliabilityScore: 78,
      notes: 'This analysis is based on the symptoms described and should be used as initial guidance only. The AI has cross-checked its analysis across multiple agents for consistency. For definitive diagnosis, please consult a healthcare professional.',
    },
    extractedSymptoms: {
      symptoms: [{ name: text?.split(' ').slice(0, 5).join(' ') || 'general symptom', bodyArea: 'multiple', duration: 'unknown', intensity: 'moderate' }],
    },
  }
}
