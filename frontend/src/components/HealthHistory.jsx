import React, { useState } from 'react'
import { TrendLine } from './Charts'

const HISTORY_KEY = 'swasthya_health_history'

export function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveToHistory(result, inputText) {
  const history = loadHistory()
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    inputText: inputText?.slice(0, 100) || 'Image analysis',
    severityLevel: result.severity?.level || 'safe',
    severityScore: result.severity?.urgencyScore || 0,
    topCondition: result.conditions?.[0]?.name || 'Unknown',
    topConfidence: result.conditions?.[0]?.confidence || 0,
    doctor: result.doctor?.specialty || 'General Physician',
    fullResult: result,
  }
  history.unshift(entry)
  // Keep max 20 entries
  if (history.length > 20) history.pop()
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export default function HealthHistory({ onViewResult }) {
  const [history, setHistory] = useState(loadHistory())
  const [expandedId, setExpandedId] = useState(null)

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
  }

  const getSeverityColor = (level) => {
    if (level === 'safe') return 'var(--safe)'
    if (level === 'attention') return 'var(--attention)'
    return 'var(--critical)'
  }

  const getSeverityIcon = (level) => {
    if (level === 'safe') return '✅'
    if (level === 'attention') return '⚠️'
    return '🚨'
  }

  // Trend data for sparkline
  const trendData = [...history]
    .reverse()
    .map((h) => ({ score: h.severityScore, date: h.date }))

  return (
    <section className="history-section page-enter" id="health-history">
      <div className="section-header">
        <h2>Health <span className="gradient-text">History</span></h2>
        <p>Track your analyses and see trends over time</p>
      </div>

      {history.length === 0 ? (
        <div className="history-empty glass-card">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <h3>No analysis history yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your past health analyses will appear here after you run your first analysis.
          </p>
        </div>
      ) : (
        <>
          {/* Trend Overview */}
          {trendData.length >= 2 && (
            <div className="glass-card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
                📈 Severity Trend
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                Your severity scores over time (lower is better)
              </p>
              <TrendLine data={trendData} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {trendData[0]?.date}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {trendData[trendData.length - 1]?.date}
                </span>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="history-stats">
            <div className="history-stat-card glass-card">
              <div className="history-stat-value">{history.length}</div>
              <div className="history-stat-label">Total Analyses</div>
            </div>
            <div className="history-stat-card glass-card">
              <div className="history-stat-value" style={{ color: getSeverityColor(history[0]?.severityLevel) }}>
                {history[0]?.severityScore}/10
              </div>
              <div className="history-stat-label">Latest Score</div>
            </div>
            <div className="history-stat-card glass-card">
              <div className="history-stat-value">
                {Math.round(history.reduce((a, h) => a + h.severityScore, 0) / history.length * 10) / 10}
              </div>
              <div className="history-stat-label">Avg Score</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="history-timeline">
            {history.map((entry) => (
              <div
                key={entry.id}
                className={`history-card glass-card ${expandedId === entry.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div className="history-card-header">
                  <div className="history-card-left">
                    <span
                      className="history-severity-dot"
                      style={{ background: getSeverityColor(entry.severityLevel) }}
                    />
                    <div>
                      <div className="history-card-condition">{entry.topCondition}</div>
                      <div className="history-card-date">{entry.date}</div>
                    </div>
                  </div>
                  <div className="history-card-right">
                    <span className="history-card-icon">{getSeverityIcon(entry.severityLevel)}</span>
                    <span
                      className="history-card-score"
                      style={{ color: getSeverityColor(entry.severityLevel) }}
                    >
                      {entry.severityScore}/10
                    </span>
                  </div>
                </div>

                {expandedId === entry.id && (
                  <div className="history-card-expanded">
                    <p className="history-card-input">
                      <strong>Input:</strong> {entry.inputText}
                    </p>
                    <div className="history-card-meta">
                      <span>🩺 {entry.doctor}</span>
                      <span>📊 {entry.topConfidence}% confidence</span>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ marginTop: 12, fontSize: '0.85rem', padding: '8px 20px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewResult(entry.fullResult)
                      }}
                    >
                      View Full Analysis →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn-secondary" onClick={clearHistory} style={{ fontSize: '0.85rem' }}>
              🗑️ Clear History
            </button>
          </div>
        </>
      )}
    </section>
  )
}
