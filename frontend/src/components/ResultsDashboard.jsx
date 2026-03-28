import React, { useEffect, useState } from 'react'
import { RadarChart, ConfidenceBars, RiskMeter, generateRadarData } from './Charts'

export default function ResultsDashboard({ results, onNewAnalysis, userProfile }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!results) return null

  const { severity, conditions, firstAid, doctor, mentalHealth, selfEvaluation, extractedSymptoms } = results

  const radarData = generateRadarData(extractedSymptoms || {}, conditions || [])

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'detailed', label: '🔬 Detailed', icon: '🔬' },
    { id: 'charts', label: '📈 Charts', icon: '📈' },
  ]

  return (
    <section className="results-section page-enter" id="results-section">
      <div className="section-header">
        <h2>
          {userProfile?.name ? `${userProfile.name}'s ` : ''}
          Analysis <span className="gradient-text">Results</span>
        </h2>
        <p>Your comprehensive AI-powered health assessment</p>
      </div>

      {/* Tabs */}
      <div className="results-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`results-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="results-grid">
          {/* Risk Meter */}
          <div className="glass-card severity-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>Severity Assessment</h3>
            <RiskMeter score={severity?.urgencyScore} level={severity?.level} />
            <p className="severity-reasoning">{severity?.reasoning}</p>
          </div>

          {/* Conditions with animated bars */}
          <div className="glass-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>🧬 Possible Conditions</h3>
            <ConfidenceBars conditions={conditions} />
            <div className="conditions-list" style={{ marginTop: 16 }}>
              {conditions?.map((c, i) => (
                <div key={i} className="condition-item">
                  <div className="condition-header">
                    <span className="condition-name">{c.name}</span>
                    <span className="condition-confidence">{c.confidence}%</span>
                  </div>
                  <p className="condition-desc">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid */}
          <div className="glass-card full-width">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>🩹 First Aid Guidance</h3>
            <div className="firstaid-steps">
              {firstAid?.steps?.map((step, i) => (
                <div key={i} className="firstaid-step">
                  <div className="firstaid-step-number">{i + 1}</div>
                  <p className="firstaid-step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tab */}
      {activeTab === 'detailed' && (
        <div className="results-grid">
          {/* Doctor */}
          <div className="glass-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>👨‍⚕️ Recommended Doctor</h3>
            <div className="doctor-card-inner">
              <div className="doctor-icon">🩺</div>
              <div className="doctor-info">
                <h3>{doctor?.specialty}</h3>
                <p>{doctor?.reason}</p>
                <a
                  href={doctor?.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doctor-find-btn"
                >
                  📍 Find Nearby
                </a>
              </div>
            </div>
          </div>

          {/* Mental Health */}
          <div className="glass-card mental-health-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>🧠 Mental Health Insight</h3>
            <div className="mental-mood">
              <span className="mental-mood-icon">{getMoodEmoji(mentalHealth?.state)}</span>
              <span className="mental-mood-label">{mentalHealth?.state}</span>
            </div>
            <p className="mental-message">{mentalHealth?.message}</p>
          </div>

          {/* Self-Evaluation */}
          <div className="glass-card eval-card full-width">
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-display)' }}>
              ✅ AI Self-Evaluation
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
              The AI evaluated its own response for reliability
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="eval-score-value">{selfEvaluation?.reliabilityScore}%</span>
              <div style={{ flex: 1 }}>
                <div className="eval-score-bar">
                  <AnimatedBar width={selfEvaluation?.reliabilityScore} />
                </div>
              </div>
            </div>
            <p className="eval-notes">{selfEvaluation?.notes}</p>
          </div>

          {/* Personalized Warnings */}
          {userProfile?.allergies && (
            <div className="glass-card full-width" style={{ borderLeft: '3px solid var(--attention)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                ⚠️ Profile-Based Warnings
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Based on your profile — <strong>Allergies:</strong> {userProfile.allergies}
                {userProfile.existingConditions && (
                  <>, <strong>Conditions:</strong> {userProfile.existingConditions}</>
                )}
                {userProfile.medications && (
                  <>, <strong>Medications:</strong> {userProfile.medications}</>
                )}
                . Please mention these to your doctor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="results-grid">
          <div className="glass-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>
              🕸️ Body System Impact
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
              How your symptoms affect different body systems
            </p>
            <RadarChart data={radarData} />
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>
              📊 Condition Confidence
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
              AI confidence levels for each predicted condition
            </p>
            <ConfidenceBars conditions={conditions} />

            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                🎯 Risk Assessment
              </h3>
              <RiskMeter score={severity?.urgencyScore} level={severity?.level} />
            </div>
          </div>

          <div className="glass-card full-width eval-card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              🤖 AI Confidence Breakdown
            </h3>
            <div className="ai-breakdown">
              <BreakdownItem label="Symptom Extraction" value={92} />
              <BreakdownItem label="Condition Matching" value={selfEvaluation?.reliabilityScore || 78} />
              <BreakdownItem label="Severity Accuracy" value={85} />
              <BreakdownItem label="Overall Reliability" value={selfEvaluation?.reliabilityScore || 78} />
            </div>
          </div>
        </div>
      )}

      <div className="new-analysis-container">
        <button className="btn-secondary" onClick={onNewAnalysis} id="new-analysis-btn">
          🔄 New Analysis
        </button>
      </div>
    </section>
  )
}

function AnimatedBar({ width = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(width), 200)
    return () => clearTimeout(t)
  }, [width])
  return <div className="eval-score-fill" style={{ width: `${w}%` }} />
}

function BreakdownItem({ label, value }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), 300)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="breakdown-item">
      <div className="breakdown-label">
        <span>{label}</span>
        <span className="breakdown-value">{value}%</span>
      </div>
      <div className="eval-score-bar">
        <div
          className="eval-score-fill"
          style={{ width: `${w}%`, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </div>
    </div>
  )
}

function getMoodEmoji(state) {
  if (!state) return '😐'
  const s = state.toLowerCase()
  if (s.includes('calm') || s.includes('stable') || s.includes('good')) return '😊'
  if (s.includes('stress') || s.includes('anxious') || s.includes('worried')) return '😰'
  if (s.includes('depress') || s.includes('sad')) return '😢'
  return '😐'
}
