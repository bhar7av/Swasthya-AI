import React, { useState, useEffect } from 'react'

const fullText = 'Your AI Health Guardian'

export default function HeroSection({ onNavigate, userName }) {
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 60)
      return () => clearTimeout(timeout)
    }
  }, [charIndex])

  return (
    <section className="hero" id="hero-section">
      <div className="hero-badge">
        <span className="pulse-dot"></span>
        AI-Powered Health Intelligence
      </div>

      <h1>
        <span className="gradient-text">{displayText}</span>
        <span style={{ opacity: charIndex < fullText.length ? 1 : 0, transition: 'opacity 0.3s' }}>|</span>
      </h1>

      <p className="hero-subtitle">
        {userName ? `Welcome back, ${userName}! ` : ''}
        Describe your symptoms or upload an image — our autonomous AI agents analyze conditions,
        assess severity, and provide instant medical guidance in seconds.
      </p>

      <div className="hero-cta">
        <button className="btn-primary" onClick={() => onNavigate('analyze')} id="start-analysis-btn">
          🔬 Start Analysis
        </button>
        <button className="btn-secondary" onClick={() => onNavigate('mental')} id="mental-health-btn">
          🧠 Mental Health Support
        </button>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value">7</div>
          <div className="hero-stat-label">AI Agents</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">&lt;10s</div>
          <div className="hero-stat-label">Analysis Time</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">Multi</div>
          <div className="hero-stat-label">Modal Input</div>
        </div>
      </div>

      {/* Heartbeat SVG */}
      <div className="heartbeat-container">
        <svg className="heartbeat-svg" viewBox="0 0 500 60" preserveAspectRatio="none">
          <path
            className="heartbeat-line"
            d="M0,30 L100,30 L120,30 L130,10 L140,50 L150,5 L160,55 L170,30 L180,30 L280,30 L300,30 L310,10 L320,50 L330,5 L340,55 L350,30 L360,30 L500,30"
          />
        </svg>
      </div>
    </section>
  )
}
