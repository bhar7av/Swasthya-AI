import React, { useState, useEffect } from 'react'

/**
 * Radar Chart — Shows symptom impact across body systems
 * Pure SVG, no external libraries
 */
export function RadarChart({ data }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const categories = data || [
    { label: 'Neurological', value: 0 },
    { label: 'Respiratory', value: 0 },
    { label: 'Cardiovascular', value: 0 },
    { label: 'Digestive', value: 0 },
    { label: 'Musculoskeletal', value: 0 },
    { label: 'Dermatological', value: 0 },
  ]

  const cx = 150, cy = 140, maxR = 100
  const n = categories.length
  const angleStep = (2 * Math.PI) / n

  // Generate grid rings
  const rings = [0.25, 0.5, 0.75, 1.0]

  // Generate data points
  const dataPoints = categories.map((cat, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = animated ? (cat.value / 100) * maxR : 0
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 20) * Math.cos(angle),
      labelY: cy + (maxR + 20) * Math.sin(angle),
      label: cat.label,
      value: cat.value,
    }
  })

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="chart-container radar-chart">
      <svg viewBox="0 0 300 300" className="radar-svg">
        {/* Grid rings */}
        {rings.map((r, i) => (
          <polygon
            key={i}
            points={Array.from({ length: n }, (_, j) => {
              const angle = j * angleStep - Math.PI / 2
              const radius = r * maxR
              return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {categories.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + maxR * Math.cos(angle)}
              y2={cy + maxR * Math.sin(angle)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(6, 214, 160, 0.15)"
          stroke="var(--cyan)"
          strokeWidth="2"
          style={{ transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 6px rgba(6,214,160,0.3))' }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <circle
              cx={animated ? p.x : cx}
              cy={animated ? p.y : cy}
              r="4"
              fill="var(--cyan)"
              stroke="var(--bg-primary)"
              strokeWidth="2"
              style={{ transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <text
              x={p.labelX}
              y={p.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="radar-label"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/**
 * Animated horizontal bar chart for condition confidence
 */
export function ConfidenceBars({ conditions }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!conditions || conditions.length === 0) return null

  const colors = ['var(--cyan)', 'var(--purple)', 'var(--pink)', 'var(--blue)', 'var(--attention)']

  return (
    <div className="chart-container confidence-bars">
      {conditions.map((c, i) => (
        <div key={i} className="conf-bar-row">
          <div className="conf-bar-label">
            <span className="conf-bar-name">{c.name}</span>
            <span className="conf-bar-value" style={{ color: colors[i % colors.length] }}>
              {c.confidence}%
            </span>
          </div>
          <div className="conf-bar-track">
            <div
              className="conf-bar-fill"
              style={{
                width: animated ? `${c.confidence}%` : '0%',
                background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}88)`,
                boxShadow: `0 0 12px ${colors[i % colors.length]}44`,
                transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.2}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Semi-circular risk meter gauge
 */
export function RiskMeter({ score = 5, level = 'attention' }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimatedScore(score), 300)
    return () => clearTimeout(t)
  }, [score])

  const getColor = () => {
    if (level === 'safe') return '#06d6a0'
    if (level === 'attention') return '#f59e0b'
    return '#ef4444'
  }

  // Semi-circle math
  const cx = 150, cy = 130
  const r = 100
  const startAngle = Math.PI
  const endAngle = 0
  const totalAngle = Math.PI
  const filledAngle = startAngle - (animatedScore / 10) * totalAngle

  const startX = cx + r * Math.cos(startAngle)
  const startY = cy - r * Math.sin(startAngle)
  const endX = cx + r * Math.cos(filledAngle)
  const endY = cy - r * Math.sin(filledAngle)

  const largeArc = (animatedScore / 10) > 0.5 ? 1 : 0

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = Math.PI - (i / 10) * Math.PI
    const innerR = r - 8
    const outerR = r + 8
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy - innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy - outerR * Math.sin(angle),
      label: i,
      labelX: cx + (outerR + 12) * Math.cos(angle),
      labelY: cy - (outerR + 12) * Math.sin(angle),
    }
  })

  // Needle
  const needleAngle = Math.PI - (animatedScore / 10) * Math.PI
  const needleX = cx + (r - 20) * Math.cos(needleAngle)
  const needleY = cy - (r - 20) * Math.sin(needleAngle)

  return (
    <div className="chart-container risk-meter">
      <svg viewBox="0 0 300 170" className="risk-meter-svg">
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {animatedScore > 0 && (
          <path
            d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            style={{
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${getColor()}66)`,
            }}
          />
        )}

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <text
              x={t.labelX} y={t.labelY}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '8px', fill: 'var(--text-muted)' }}
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={needleX} y2={needleY}
          stroke={getColor()}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <circle cx={cx} cy={cy} r="6" fill={getColor()} />

        {/* Center text */}
        <text
          x={cx} y={cy + 30}
          textAnchor="middle"
          style={{
            fontSize: '28px',
            fontWeight: '800',
            fill: getColor(),
            fontFamily: 'var(--font-display)',
          }}
        >
          {animatedScore}/10
        </text>
        <text
          x={cx} y={cy + 48}
          textAnchor="middle"
          style={{
            fontSize: '11px',
            fill: getColor(),
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600',
          }}
        >
          {level}
        </text>
      </svg>
    </div>
  )
}

/**
 * Severity trend sparkline for history
 */
export function TrendLine({ data }) {
  if (!data || data.length < 2) return null

  const width = 300, height = 60
  const padding = 10
  const maxVal = 10

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - 2 * padding),
    y: padding + ((maxVal - d.score) / maxVal) * (height - 2 * padding),
    score: d.score,
    date: d.date,
  }))

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ')

  // Area fill
  const areaD = pathD + ` L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`

  return (
    <div className="chart-container trend-line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(6,214,160,0.3)" />
            <stop offset="100%" stopColor="rgba(6,214,160,0)" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#trendGrad)" />
        <path d={pathD} fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--cyan)" stroke="var(--bg-primary)" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  )
}

/**
 * Generate radar data from analysis results
 */
export function generateRadarData(symptoms, conditions) {
  const systems = {
    Neurological: ['headache', 'dizziness', 'migraine', 'numbness', 'seizure', 'confusion', 'brain'],
    Respiratory: ['breathing', 'cough', 'wheezing', 'chest', 'lung', 'asthma', 'shortness'],
    Cardiovascular: ['heart', 'chest pain', 'palpitation', 'blood pressure', 'pulse'],
    Digestive: ['stomach', 'nausea', 'vomiting', 'diarrhea', 'bloating', 'abdominal'],
    Musculoskeletal: ['pain', 'joint', 'muscle', 'back', 'knee', 'shoulder', 'arm', 'leg'],
    Dermatological: ['rash', 'skin', 'itch', 'swelling', 'wound', 'burn', 'blister'],
  }

  const allText = JSON.stringify({ symptoms, conditions }).toLowerCase()

  return Object.entries(systems).map(([label, keywords]) => {
    const matchCount = keywords.filter((kw) => allText.includes(kw)).length
    const value = Math.min(Math.round((matchCount / keywords.length) * 100), 100)
    return { label, value: Math.max(value, 5) } // minimum 5 for visibility
  })
}
