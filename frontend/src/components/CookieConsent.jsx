import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import PrivacyContent from './PrivacyContent'
import './CookieConsent.css'

const CookieConsent = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const debugCompliance =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_SHOW_COMPLIANCE_BANNERS === 'true'

  useEffect(() => {
    // 使用用户ID作为key的一部分，确保每个账户只显示一次
    const userId = user?.id || 'anonymous'
    const ageStorageKey = `age-verified-${userId}`
    const cookieStorageKey = `cookie-consent-${userId}`
    
    // 检查是否已经验证过年龄
    const ageVerified = localStorage.getItem(ageStorageKey)
    // 检查是否已经同意过Cookie
    const cookieConsent = localStorage.getItem(cookieStorageKey)
    
    // 调试模式强制显示；否则仅在年龄验证通过且未同意Cookie时显示
    if (debugCompliance || (ageVerified === 'true' && !cookieConsent)) {
      // 延迟显示，让页面先加载
      const timer = setTimeout(() => {
        setShow(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, debugCompliance])

  const handleAccept = () => {
    const userId = user?.id || 'anonymous'
    const storageKey = `cookie-consent-${userId}`
    localStorage.setItem(storageKey, 'accepted')
    localStorage.setItem(`${storageKey}-date`, new Date().toISOString())
    setShow(false)
  }

  const handleDecline = () => {
    const userId = user?.id || 'anonymous'
    const storageKey = `cookie-consent-${userId}`
    localStorage.setItem(storageKey, 'declined')
    localStorage.setItem(`${storageKey}-date`, new Date().toISOString())
    setShow(false)
    // 拒绝Cookie同意，跳转到外部网站
    window.location.href = 'https://www.google.com'
  }

  const handlePrivacyOpen = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setShowPrivacyModal(true)
  }, [])

  const handlePrivacyClose = useCallback((e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setShowPrivacyModal(false)
  }, [])

  const handlePrivacyOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handlePrivacyClose(e)
    }
  }, [handlePrivacyClose])

  // 使用 useMemo 缓存翻译文本
  const privacyTitle = useMemo(() => t('auth.privacyTitle'), [t])
  const okText = useMemo(() => t('common.ok') || 'OK', [t])

  const PrivacyModal = useMemo(() => {
    if (!showPrivacyModal) return null
    
    const modalContent = (
      <div className="agreement-modal-overlay" onClick={handlePrivacyOverlayClick}>
        <div className="agreement-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handlePrivacyClose}>
            ×
          </button>
          <h2 className="modal-title">
            {privacyTitle}
          </h2>
          <div className="agreement-content">
            <PrivacyContent />
          </div>
          <div className="agreement-actions">
            <button
              type="button"
              className="modal-submit-button"
              onClick={handlePrivacyClose}
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    )
    
    return createPortal(modalContent, document.body)
  }, [showPrivacyModal, handlePrivacyClose, handlePrivacyOverlayClick, privacyTitle, okText])

  if (!show) return null

  // 使用 portal 挂载到 body，避免被父级布局影响
  const banner = (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-consent-content">
          <div className="cookie-consent-icon">🍪</div>
          <div className="cookie-consent-text">
            <h3 className="cookie-consent-title">{t('cookie.title')}</h3>
            <p className="cookie-consent-description">
              {t('cookie.description')}
              <button
                type="button"
                onClick={handlePrivacyOpen}
                className="cookie-consent-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {t('cookie.privacyLink')}
              </button>
            </p>
          </div>
        </div>
        <div className="cookie-consent-actions">
          <button
            onClick={handleDecline}
            className="cookie-consent-button cookie-consent-button-decline"
          >
            {t('cookie.decline')}
          </button>
          <button
            onClick={handleAccept}
            className="cookie-consent-button cookie-consent-button-accept"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? (
    <>
      {createPortal(banner, document.body)}
      {PrivacyModal}
    </>
  ) : null
}

export default CookieConsent

