import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import TermsContent from './TermsContent'
import PrivacyContent from './PrivacyContent'
import './Modal.css'

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(null) // 存储错误键而不是翻译后的文本
  const [loading, setLoading] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [modalType, setModalType] = useState('terms') // 'terms' | 'privacy'
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  React.useEffect(() => {
    // 打开弹窗时锁定背景滚动
    const previousOverflow = document.body.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const scrollY = window.scrollY
    
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorKey(null)
    setLoading(true)

    if (!consentChecked) {
      setLoading(false)
      setErrorKey('auth.error.consentRequired')
      return
    }

    const result = await login(formData)
    
    if (result.success) {
      onClose()
      navigate('/')
    } else {
      // 存储错误键或原始错误消息
      const errorStr = String(result.error || '')
      if (errorStr.startsWith('error.')) {
        setErrorKey(errorStr)
      } else {
        setError(errorStr)
      }
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAgreementClose = useCallback((e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setShowAgreementModal(false)
  }, [])

  const handleAgreementOpen = useCallback((type, e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    // 使用函数式更新避免状态冲突
    setShowAgreementModal(prev => {
      if (prev) return prev // 如果已经打开，不重复打开
      return true
    })
    setModalType(type)
  }, [])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleAgreementClose(e)
    }
  }, [handleAgreementClose])

  // 使用 useMemo 缓存翻译文本，避免 t 函数变化导致重新渲染
  const termsTitle = React.useMemo(() => t('auth.termsTitle'), [t])
  const privacyTitle = React.useMemo(() => t('auth.privacyTitle'), [t])
  const okText = React.useMemo(() => t('common.ok') || 'OK', [t])

  const AgreementModal = React.useMemo(() => {
    if (!showAgreementModal) return null
    const isTerms = modalType === 'terms'
    
    const modalContent = (
      <div className="agreement-modal-overlay" onClick={handleOverlayClick}>
        <div className="agreement-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleAgreementClose}>
            ×
          </button>
          <h2 className="modal-title">
            {isTerms ? termsTitle : privacyTitle}
          </h2>
          <div className="agreement-content">
            {isTerms ? <TermsContent /> : <PrivacyContent />}
          </div>
          <div className="agreement-actions">
            <button
              type="button"
              className="modal-submit-button"
              onClick={handleAgreementClose}
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    )
    
    return createPortal(modalContent, document.body)
  }, [showAgreementModal, modalType, handleAgreementClose, handleOverlayClick, termsTitle, privacyTitle, okText])

  const handleMainOverlayClick = useCallback((e) => {
    if (!showAgreementModal && e.target === e.currentTarget) {
      onClose()
    }
  }, [showAgreementModal, onClose])

  const mainModalContent = (
    <div className="modal-overlay" onClick={handleMainOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">{t('auth.loginTitle')}</h2>
        
        <p className="modal-agreement">
          {t('auth.agreementPrefix')}
          <button
            type="button"
            className="switch-link"
            onClick={(e) => handleAgreementOpen('terms', e)}
          >
            {t('auth.agreementUser')}
          </button>
          {t('auth.agreementPrivacyPrefix')}
          <button
            type="button"
            className="switch-link"
            onClick={(e) => handleAgreementOpen('privacy', e)}
          >
            {t('auth.agreementPrivacy')}
          </button>
        </p>

        {(error || errorKey) && (
          <div className="modal-error">
            {errorKey ? t(errorKey) : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="login">{t('auth.emailOrUsername')}</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder={t('auth.emailOrUsernamePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={t('auth.passwordPlaceholder')}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              style={{ width: '1rem', height: '1rem' }}
            />
            <label htmlFor="consent" style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {t('auth.consentLabel')}
            </label>
          </div>

          <div className="form-actions">
            <a href="#" className="forgot-password">{t('auth.forgotPassword')}</a>
          </div>

          <button
            type="submit"
            className="modal-submit-button"
            disabled={loading}
          >
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>

        <div className="modal-switch">
          <p>
            {t('auth.newUser')}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="switch-link"
            >
              {t('auth.register')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? (
    <>
      {createPortal(mainModalContent, document.body)}
      {AgreementModal}
    </>
  ) : null
}

export default LoginModal









