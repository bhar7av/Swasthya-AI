import React from 'react'

const particles = ['💊', '🩺', '❤️', '🧬', '🏥', '💉', '🫀', '🧠', '🩹', '⚕️']

export default function ParticleBackground() {
  return (
    <div className="particles">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`,
            fontSize: `${0.8 + Math.random() * 1.2}rem`,
          }}
        >
          {p}
        </span>
      ))}
    </div>
  )
}
