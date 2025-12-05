import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronDown } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import './AgeVerification.css'

const AgeVerification = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const debugCompliance =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_SHOW_COMPLIANCE_BANNERS === 'true'

  useEffect(() => {
    // 使用用户ID作为key的一部分，确保每个账户只显示一次
    const userId = user?.id || 'anonymous'
    const storageKey = `age-verified-${userId}`
    const ageVerified = localStorage.getItem(storageKey)
    
    if (debugCompliance || !ageVerified) {
      setShow(true)
    }
  }, [user, debugCompliance])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleAcknowledge = () => {
    const userId = user?.id || 'anonymous'
    const storageKey = `age-verified-${userId}`
    localStorage.setItem(storageKey, 'true')
    localStorage.setItem(`${storageKey}-date`, new Date().toISOString())
    setShow(false)
  }

  const handleDecline = () => {
    const userId = user?.id || 'anonymous'
    const storageKey = `age-verified-${userId}`
    localStorage.setItem(storageKey, 'declined')
    localStorage.setItem(`${storageKey}-date`, new Date().toISOString())
    setShow(false)
    // 拒绝年龄验证，跳转到外部网站
    window.location.href = 'https://www.google.com'
  }

  if (!show) return null

  // 使用 portal 挂载到 body，避免被父级布局影响
  const banner = (
    <div className="age-banner-overlay">
      <div className="age-banner">
        <div className="age-banner-header" onClick={() => isMobile && setExpanded(!expanded)}>
          <h3 className="age-banner-title">
            {t('age.bannerTitle')}
          </h3>
          {isMobile && (
            <FaChevronDown className={`age-banner-expand-icon ${expanded ? 'expanded' : ''}`} />
          )}
        </div>
        <div className={`age-banner-content ${isMobile && !expanded ? 'collapsed' : ''}`}>
          <div className="age-banner-text">
            <p className="age-banner-description">
              {t('age.bannerDescription')}
            </p>
            <p className="age-banner-note">
              {t('age.bannerNote')}
            </p>
          </div>
        </div>
        <div className="age-banner-actions">
          <button
            onClick={handleDecline}
            className="age-banner-button age-banner-button-decline"
          >
            {t('age.bannerDecline')}
          </button>
          <button
            onClick={handleAcknowledge}
            className="age-banner-button age-banner-button-accept"
          >
            {t('age.bannerAccept')}
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(banner, document.body)
    : null
}

export default AgeVerification




















