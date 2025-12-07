import React, { useMemo } from 'react'
import './IntroLoader.css'

function IntroLoader({ label, progress }) {
  const displayProgress = Math.min(Math.max(progress, 0), 100)

  const { strokeDasharray, strokeDashoffset } = useMemo(() => {
    const radius = 64
    const circumference = 2 * Math.PI * radius
    const clamped = Math.max(0, Math.min(displayProgress, 100))
    const offset = circumference - (clamped / 100) * circumference
    return {
      strokeDasharray: `${circumference}px`,
      strokeDashoffset: `${offset}px`,
    }
  }, [displayProgress])

  return (
    <div className="intro-loader" role="status" aria-live="polite">
      <div className="intro-loader__title">
        <span className="intro-loader__title-mark">RE</span>
        <span>FORUM</span>
      </div>

      <div className="intro-loader__ring">
        <svg viewBox="0 0 160 160" className="intro-loader__svg" aria-hidden="true">
          <defs>
            <linearGradient id="introLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--secondary-color, #38bdf8)" />
              <stop offset="100%" stopColor="var(--primary-color, #6366f1)" />
            </linearGradient>
          </defs>
          <circle className="intro-loader__track" cx="80" cy="80" r="64" />
          <circle
            className="intro-loader__progress"
            cx="80"
            cy="80"
            r="64"
            stroke="url(#introLoaderGradient)"
            style={{ strokeDasharray, strokeDashoffset }}
          />
        </svg>
        <div className="intro-loader__value">{displayProgress}%</div>
      </div>

      <p className="intro-loader__label">{label}</p>
    </div>
  )
}

export default IntroLoader


