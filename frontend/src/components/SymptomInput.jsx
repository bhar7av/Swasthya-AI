import React, { useState, useRef } from 'react'
import BodyMap, { getSelectedSymptomsText } from './BodyMap'

export default function SymptomInput({ onAnalyze, loading, userProfile }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedBodyParts, setSelectedBodyParts] = useState([])
  const [isListening, setIsListening] = useState(false)
  const fileRef = useRef()
  const recognitionRef = useRef(null)

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleImageChange(file)
  }

  const handleToggleBodyPart = (partId) => {
    setSelectedBodyParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    )
  }

  const handleSubmit = () => {
    const bodyText = getSelectedSymptomsText(selectedBodyParts)
    const fullText = [text, bodyText].filter(Boolean).join('. ')
    if (!fullText.trim() && !image) return
    onAnalyze(fullText, image)
  }

  // Voice Input — Web Speech API
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText((prev) => {
        // Replace the last interim result
        const base = prev.replace(/\s*\[listening\.\.\.\]\s*$/, '')
        return base + (base ? ' ' : '') + transcript
      })
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const agentStages = [
    { icon: '🔍', name: 'Symptom Extraction Agent', delay: 0 },
    { icon: '🧬', name: 'Condition Analysis Agent', delay: 2000 },
    { icon: '🧠', name: 'Mental Health Agent', delay: 2000 },
    { icon: '⚠️', name: 'Severity Assessment Agent', delay: 3500 },
    { icon: '🩺', name: 'Doctor Recommendation Agent', delay: 3500 },
    { icon: '🩹', name: 'First Aid Support Agent', delay: 5000 },
    { icon: '✅', name: 'Self-Evaluation Agent', delay: 6500 },
  ]

  if (loading) {
    return (
      <div className="loading-container page-enter">
        <div className="loading-spinner"></div>
        <p className="loading-text">
          {userProfile?.name ? `Analyzing for ${userProfile.name}...` : 'AI Agents analyzing your symptoms...'}
        </p>
        <div className="loading-agents">
          {agentStages.map((agent, i) => (
            <LoadingAgent key={i} agent={agent} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="analyze-section page-enter" id="analyze-section">
      <div className="section-header">
        <h2>
          {userProfile?.name ? `Hey ${userProfile.name}, ` : ''}
          Describe Your <span className="gradient-text">Symptoms</span>
        </h2>
        <p>Tap affected body areas, type, speak, or upload an image</p>
      </div>

      {/* Body Map */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <BodyMap selectedParts={selectedBodyParts} onTogglePart={handleToggleBodyPart} />
      </div>

      <div className="input-container">
        {/* Text + Voice Input */}
        <div className="textarea-wrapper">
          <textarea
            className="symptom-textarea"
            placeholder="e.g., I've had a severe headache and mild fever for the past 3 days. I also feel dizzy when standing up..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="symptom-text-input"
          />
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoiceInput}
            title={isListening ? 'Stop listening' : 'Speak your symptoms'}
            id="voice-input-btn"
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
        </div>

        {isListening && (
          <div className="voice-indicator">
            <span className="voice-pulse"></span>
            <span>Listening... speak your symptoms</span>
          </div>
        )}

        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          id="image-upload-zone"
        >
          <div className="upload-zone-icon">📸</div>
          <p className="upload-zone-text">
            <strong>Click to upload</strong> or drag and drop an image
          </p>
          <p className="upload-zone-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
            Skin rashes, injuries, wounds — our AI can analyze images too
          </p>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Upload preview" />
            <button
              className="image-preview-remove"
              onClick={() => { setImage(null); setImagePreview(null); }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="analyze-btn-container">
        <button
          className="btn-primary analyze-btn"
          onClick={handleSubmit}
          disabled={!text.trim() && !image && selectedBodyParts.length === 0}
          id="analyze-submit-btn"
        >
          🔬 Analyze with AI Agents
        </button>
      </div>
    </section>
  )
}

function LoadingAgent({ agent }) {
  const [active, setActive] = useState(false)
  const [done, setDone] = useState(false)

  React.useEffect(() => {
    const t1 = setTimeout(() => setActive(true), agent.delay)
    const t2 = setTimeout(() => { setActive(false); setDone(true); }, agent.delay + 1800)
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, [])

  return (
    <div className={`loading-agent ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
      <span className="loading-agent-icon">{agent.icon}</span>
      <span>{agent.name}</span>
      {done && <span className="loading-agent-check">✓</span>}
    </div>
  )
}
