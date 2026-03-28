import React, { useState, useRef, useEffect } from 'react'

export default function Navbar({ currentPage, onNavigate, userProfile, showSOS, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on page change
  useEffect(() => {
    setMenuOpen(false)
  }, [currentPage])

  const initial = userProfile?.name?.charAt(0)?.toUpperCase() || 'U'

  const navLinks = [
    { key: 'home', label: 'Home' },
    { key: 'analyze', label: 'Analyze' },
    { key: 'mental', label: 'Mental Health' },
    { key: 'history', label: 'History' },
  ]

  return (
    <nav className="navbar" id="main-navbar">
      <a className="navbar-logo" href="#" onClick={() => onNavigate('home')}>
        <div className="navbar-logo-icon">⚕️</div>
        <span className="navbar-logo-text">SwasthyaAI</span>
      </a>

      {/* Hamburger button */}
      <button
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        id="hamburger-btn"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Nav links */}
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.key}>
            <a
              href="#"
              className={currentPage === link.key ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onNavigate(link.key); }}
            >
              {link.label}
            </a>
          </li>
        ))}
        {/* Mobile-only items */}
        {menuOpen && (
          <>
            <li className="mobile-nav-divider" />
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>
                👤 Edit Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="mobile-nav-logout"
                onClick={(e) => { e.preventDefault(); onLogout(); }}
              >
                🚪 Log Out
              </a>
            </li>
          </>
        )}
      </ul>

      <div className="navbar-right">
        {/* SOS Button */}
        {showSOS && (
          <a
            href="tel:112"
            className="sos-btn"
            title="Call Emergency Services (112)"
            id="emergency-sos-btn"
          >
            🚨 SOS
          </a>
        )}

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button
            className="profile-badge"
            onClick={() => setShowDropdown(!showDropdown)}
            id="profile-badge"
          >
            <div className="profile-avatar">{initial}</div>
            <span className="profile-badge-name">{userProfile?.name || 'User'}</span>
            <span className="profile-chevron">{showDropdown ? '▲' : '▼'}</span>
          </button>

          {showDropdown && (
            <div className="profile-dropdown glass-card">
              <div className="profile-dropdown-header">
                <div className="profile-avatar" style={{ width: 40, height: 40, fontSize: '1rem' }}>
                  {initial}
                </div>
                <div>
                  <div className="profile-dropdown-name">{userProfile?.name || 'User'}</div>
                  <div className="profile-dropdown-email">{userProfile?.email || ''}</div>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              <button
                className="profile-dropdown-item"
                onClick={() => { setShowDropdown(false); onNavigate('profile'); }}
              >
                <span>👤</span> Edit Profile
              </button>
              <button
                className="profile-dropdown-item"
                onClick={() => { setShowDropdown(false); onNavigate('history'); }}
              >
                <span>📋</span> Health History
              </button>

              <div className="profile-dropdown-divider" />

              <button
                className="profile-dropdown-item profile-dropdown-logout"
                onClick={() => { setShowDropdown(false); onLogout(); }}
                id="logout-btn"
              >
                <span>🚪</span> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
