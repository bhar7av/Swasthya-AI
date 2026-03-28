import React, { useState, useRef, useEffect } from 'react'

export default function MentalHealthChat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi, I'm your mental wellness companion 💜 How are you feeling today? I'm here to listen and help.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState('Breathe In')
  const chatEndRef = useRef()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Breathing exercise phases
  useEffect(() => {
    if (!breathingActive) return
    const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold']
    const durations = [4000, 4000, 4000, 4000]
    let i = 0
    let timeout

    const cycle = () => {
      setBreathPhase(phases[i % phases.length])
      timeout = setTimeout(() => {
        i++
        cycle()
      }, durations[i % durations.length])
    }
    cycle()

    return () => clearTimeout(timeout)
  }, [breathingActive])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/mental-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, { role: 'bot', text: data.response }])
      } else {
        // Fallback supportive responses
        const fallbacks = [
          "I hear you, and what you're feeling is completely valid. Remember, it's okay to not be okay sometimes. Would you like to try a breathing exercise together?",
          "Thank you for sharing that with me. You're being very brave. Taking small steps every day — like you're doing now — is what matters most. 💜",
          "That sounds challenging. Remember that seeking help is a sign of strength, not weakness. Would you like some calming techniques?",
          "I understand how you feel. Let's take a moment to ground ourselves. Try naming 5 things you can see around you right now. This can help bring you to the present.",
          "You're not alone in this. Many people experience similar feelings. What helps is to break things into small, manageable steps. What's one tiny thing you could do for yourself today?",
        ]
        const randomResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)]
        setMessages((prev) => [...prev, { role: 'bot', text: randomResponse }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "I'm here for you. While my full AI capabilities require the backend to be running, please know that you're doing great by reaching out. Would you like to try a breathing exercise? It can help calm the mind. 💜",
        },
      ])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <section className="mental-section page-enter" id="mental-health-section">
      <div className="section-header">
        <h2>Mental <span className="gradient-text">Wellness</span></h2>
        <p>A safe space to talk about how you're feeling</p>
      </div>

      <div className="chat-container" id="mental-health-chat">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chat-message bot" style={{ opacity: 0.6 }}>
            <em>Thinking...</em>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Share how you're feeling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          id="mental-chat-input"
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          id="mental-chat-send"
        >
          Send
        </button>
      </div>

      {/* Breathing Exercise */}
      <div className="breathing-widget glass-card" id="breathing-exercise">
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          🫁 Breathing Exercise
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          A simple 4-4-4-4 box breathing technique to calm your mind
        </p>

        <div className="breathing-circle">
          {breathingActive ? breathPhase : 'Start'}
        </div>

        <button
          className={breathingActive ? 'btn-secondary' : 'btn-primary'}
          onClick={() => setBreathingActive(!breathingActive)}
          style={{ fontSize: '0.9rem' }}
          id="breathing-toggle-btn"
        >
          {breathingActive ? '⏸ Stop' : '▶ Begin Breathing'}
        </button>

        <p className="breathing-instruction">
          {breathingActive
            ? 'Follow the circle. Breathe in for 4s, hold 4s, breathe out 4s, hold 4s.'
            : 'Click to start a guided breathing exercise'}
        </p>
      </div>
    </section>
  )
}
