import React, { useState } from 'react'

const bodyParts = [
  { id: 'head', label: 'Head', cx: 150, cy: 45, rx: 28, ry: 32, symptoms: 'headache, dizziness, migraine' },
  { id: 'face', label: 'Face / Eyes / Ears', cx: 150, cy: 75, rx: 22, ry: 12, symptoms: 'eye pain, earache, face swelling' },
  { id: 'throat', label: 'Throat / Neck', cx: 150, cy: 100, rx: 15, ry: 10, symptoms: 'sore throat, neck stiffness, swollen glands' },
  { id: 'leftShoulder', label: 'Left Shoulder', cx: 100, cy: 130, rx: 18, ry: 12, symptoms: 'left shoulder pain' },
  { id: 'rightShoulder', label: 'Right Shoulder', cx: 200, cy: 130, rx: 18, ry: 12, symptoms: 'right shoulder pain' },
  { id: 'chest', label: 'Chest', cx: 150, cy: 160, rx: 35, ry: 25, symptoms: 'chest pain, difficulty breathing, heart palpitations' },
  { id: 'stomach', label: 'Stomach / Abdomen', cx: 150, cy: 210, rx: 30, ry: 22, symptoms: 'stomach pain, nausea, bloating, vomiting' },
  { id: 'leftArm', label: 'Left Arm', cx: 80, cy: 200, rx: 12, ry: 40, symptoms: 'left arm pain, numbness in left arm' },
  { id: 'rightArm', label: 'Right Arm', cx: 220, cy: 200, rx: 12, ry: 40, symptoms: 'right arm pain, numbness in right arm' },
  { id: 'pelvis', label: 'Lower Abdomen / Pelvis', cx: 150, cy: 255, rx: 28, ry: 18, symptoms: 'lower abdominal pain, pelvic pain, cramps' },
  { id: 'leftHand', label: 'Left Hand', cx: 72, cy: 270, rx: 10, ry: 14, symptoms: 'left hand pain, finger numbness' },
  { id: 'rightHand', label: 'Right Hand', cx: 228, cy: 270, rx: 10, ry: 14, symptoms: 'right hand pain, finger numbness' },
  { id: 'leftThigh', label: 'Left Thigh', cx: 130, cy: 310, rx: 16, ry: 35, symptoms: 'left thigh pain, leg weakness' },
  { id: 'rightThigh', label: 'Right Thigh', cx: 170, cy: 310, rx: 16, ry: 35, symptoms: 'right thigh pain, leg weakness' },
  { id: 'leftKnee', label: 'Left Knee', cx: 128, cy: 360, rx: 13, ry: 12, symptoms: 'left knee pain, knee swelling' },
  { id: 'rightKnee', label: 'Right Knee', cx: 172, cy: 360, rx: 13, ry: 12, symptoms: 'right knee pain, knee swelling' },
  { id: 'leftLeg', label: 'Left Shin / Calf', cx: 126, cy: 405, rx: 11, ry: 30, symptoms: 'left leg pain, calf cramp' },
  { id: 'rightLeg', label: 'Right Shin / Calf', cx: 174, cy: 405, rx: 11, ry: 30, symptoms: 'right leg pain, calf cramp' },
  { id: 'leftFoot', label: 'Left Foot', cx: 122, cy: 450, rx: 14, ry: 10, symptoms: 'left foot pain, ankle swelling' },
  { id: 'rightFoot', label: 'Right Foot', cx: 178, cy: 450, rx: 14, ry: 10, symptoms: 'right foot pain, ankle swelling' },
  { id: 'back', label: 'Back / Spine', cx: 150, cy: 185, rx: 18, ry: 50, symptoms: 'back pain, spine pain, lower back ache' },
]

export default function BodyMap({ selectedParts, onTogglePart }) {
  const [hoveredPart, setHoveredPart] = useState(null)

  return (
    <div className="body-map-container">
      <h4 className="body-map-title">
        👆 Tap affected areas <span className="body-map-hint">(or type below)</span>
      </h4>

      <div className="body-map-wrapper">
        <svg viewBox="0 0 300 470" className="body-map-svg">
          <defs>
            <filter id="glow-safe">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-hover">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Body silhouette gradient */}
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>

          {/* Body outline silhouette */}
          <path
            d="M150,12 C170,12 175,30 175,45 C175,60 168,75 165,80 L165,90 C175,90 195,105 210,120 C225,130 240,160 240,180 L238,250 C238,260 235,270 232,280 L215,270 C215,255 210,230 210,210 L200,145 C195,135 185,128 175,125 L175,230 C180,240 182,250 182,260 L185,290 C188,320 188,345 186,365 L184,400 C183,420 182,435 185,455 C186,460 175,465 165,460 L158,395 C156,370 155,340 155,310 L150,310 L145,310 C145,340 144,370 142,395 L135,460 C125,465 114,460 115,455 C118,435 117,420 116,400 L114,365 C112,345 112,320 115,290 L118,260 C118,250 120,240 125,230 L125,125 C115,128 105,135 100,145 L90,210 C90,230 85,255 85,270 L68,280 C65,270 62,260 62,250 L60,180 C60,160 75,130 90,120 C105,105 125,90 135,90 L135,80 C132,75 125,60 125,45 C125,30 130,12 150,12 Z"
            fill="url(#bodyGrad)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          {/* Clickable body part regions */}
          {bodyParts.map((part) => {
            const isSelected = selectedParts.includes(part.id)
            const isHovered = hoveredPart === part.id

            return (
              <g key={part.id}>
                <ellipse
                  cx={part.cx}
                  cy={part.cy}
                  rx={part.rx}
                  ry={part.ry}
                  className={`body-part ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => onTogglePart(part.id)}
                  onMouseEnter={() => setHoveredPart(part.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  filter={isSelected ? 'url(#glow-safe)' : isHovered ? 'url(#glow-hover)' : 'none'}
                  style={{
                    fill: isSelected
                      ? 'rgba(6, 214, 160, 0.35)'
                      : isHovered
                        ? 'rgba(139, 92, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.03)',
                    stroke: isSelected
                      ? 'var(--cyan)'
                      : isHovered
                        ? 'var(--purple)'
                        : 'rgba(255, 255, 255, 0.06)',
                    strokeWidth: isSelected ? 2 : 1,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
                {/* Label on hover */}
                {isHovered && (
                  <text
                    x={part.cx}
                    y={part.cy - part.ry - 6}
                    textAnchor="middle"
                    className="body-part-label"
                  >
                    {part.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Selected parts chips */}
        {selectedParts.length > 0 && (
          <div className="body-map-chips">
            {selectedParts.map((id) => {
              const part = bodyParts.find((p) => p.id === id)
              return (
                <span key={id} className="body-chip" onClick={() => onTogglePart(id)}>
                  {part?.label} ✕
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Export body parts data for use in symptom text generation
export function getSelectedSymptomsText(selectedPartIds) {
  return selectedPartIds
    .map((id) => {
      const part = bodyParts.find((p) => p.id === id)
      return part ? `Affected area: ${part.label} (${part.symptoms})` : ''
    })
    .filter(Boolean)
    .join('. ')
}
