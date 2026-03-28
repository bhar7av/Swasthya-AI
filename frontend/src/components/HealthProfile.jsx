import React, { useState, useEffect } from 'react'

const PROFILE_KEY = 'swasthya_user_profile'

export function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export default function HealthProfile({ onComplete, existingProfile }) {
  const [profile, setProfile] = useState(
    existingProfile || {
      name: '',
      age: '',
      gender: '',
      bloodGroup: '',
      existingConditions: '',
      allergies: '',
      medications: '',
    }
  )

  const [step, setStep] = useState(0)

  const update = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    saveProfile(profile)
    onComplete(profile)
  }

  const steps = [
    {
      title: 'Welcome to SwasthyaAI 👋',
      subtitle: "Let's personalize your experience",
      fields: (
        <>
          <div className="profile-field">
            <label>What's your name?</label>
            <input
              className="profile-input"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => update('name', e.target.value)}
              autoFocus
              id="profile-name-input"
            />
          </div>
          <div className="profile-row">
            <div className="profile-field">
              <label>Age</label>
              <input
                className="profile-input"
                type="number"
                placeholder="25"
                value={profile.age}
                onChange={(e) => update('age', e.target.value)}
                id="profile-age-input"
              />
            </div>
            <div className="profile-field">
              <label>Gender</label>
              <div className="profile-chips">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    className={`profile-chip ${profile.gender === g ? 'active' : ''}`}
                    onClick={() => update('gender', g)}
                  >
                    {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '🧑'} {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Medical Background 🏥',
      subtitle: 'This helps our AI give better advice',
      fields: (
        <>
          <div className="profile-field">
            <label>Blood Group</label>
            <div className="profile-chips">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <button
                  key={bg}
                  className={`profile-chip ${profile.bloodGroup === bg ? 'active' : ''}`}
                  onClick={() => update('bloodGroup', bg)}
                >
                  🩸 {bg}
                </button>
              ))}
            </div>
          </div>
          <div className="profile-field">
            <label>Existing conditions (if any)</label>
            <input
              className="profile-input"
              placeholder="e.g., Diabetes, Asthma, Hypertension"
              value={profile.existingConditions}
              onChange={(e) => update('existingConditions', e.target.value)}
              id="profile-conditions-input"
            />
          </div>
          <div className="profile-field">
            <label>Allergies (if any)</label>
            <input
              className="profile-input"
              placeholder="e.g., Penicillin, Peanuts, Dust"
              value={profile.allergies}
              onChange={(e) => update('allergies', e.target.value)}
              id="profile-allergies-input"
            />
          </div>
          <div className="profile-field">
            <label>Current medications (if any)</label>
            <input
              className="profile-input"
              placeholder="e.g., Metformin, Inhaler"
              value={profile.medications}
              onChange={(e) => update('medications', e.target.value)}
              id="profile-medications-input"
            />
          </div>
        </>
      ),
    },
  ]

  return (
    <div className="profile-overlay page-enter">
      <div className="profile-card glass-card">
        {/* Progress dots */}
        <div className="profile-progress">
          {steps.map((_, i) => (
            <div key={i} className={`profile-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        <h2 className="profile-title">{steps[step].title}</h2>
        <p className="profile-subtitle">{steps[step].subtitle}</p>

        <div className="profile-fields">{steps[step].fields}</div>

        <div className="profile-actions">
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !profile.name}
            >
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} id="profile-submit-btn">
              🚀 Start Using SwasthyaAI
            </button>
          )}
        </div>

        {step === 0 && (
          <button
            className="profile-skip"
            onClick={() => {
              saveProfile({ ...profile, name: profile.name || 'User' })
              onComplete({ ...profile, name: profile.name || 'User' })
            }}
          >
            Skip for now →
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Small profile badge for the navbar
 */
export function ProfileBadge({ profile, onClick }) {
  if (!profile?.name) return null
  const initial = profile.name.charAt(0).toUpperCase()

  return (
    <button className="profile-badge" onClick={onClick} title="Edit Profile" id="profile-badge">
      <div className="profile-avatar">{initial}</div>
      <span className="profile-badge-name">{profile.name}</span>
    </button>
  )
}
