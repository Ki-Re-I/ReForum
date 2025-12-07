import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import TermsContent from './TermsContent'
import PrivacyContent from './PrivacyContent'
import './Modal.css'

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  })
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(null) // 存储错误键而不是翻译后的文本
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [modalType, setModalType] = useState('terms')
  const { register } = useAuth()
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

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrorKey('auth.error.emailRequired')
      setError('')
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorKey('auth.error.invalidEmail')
      setError('')
      return
    }

    setError('')
    setErrorKey(null)
    setSendingCode(true)

    try {
      const response = await authAPI.sendVerificationCode(formData.email)
      setCodeSent(true)
      setCountdown(60) // 60秒倒计时

      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      // 后端返回的错误消息直接显示
      setError(err.response?.data?.message || t('auth.error.sendCodeFailed'))
      setErrorKey(null)
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorKey(null)

    if (!formData.verificationCode) {
      setErrorKey('auth.error.codeRequired')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorKey('auth.error.passwordMismatch')
      return
    }

    if (formData.password.length < 6) {
      setErrorKey('auth.error.passwordTooShort')
      return
    }

    if (!codeSent) {
      setErrorKey('auth.error.codeNotSent')
      return
    }

    if (!consentChecked) {
      setErrorKey('auth.error.consentRequired')
      return
    }

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
    if (result.success) {
      onClose()
      navigate('/')
    } else {
      // 存储错误键或原始错误消息
      const errorStr = String(result.error || '')
      if (errorStr.startsWith('error.') || errorStr.startsWith('auth.error.')) {
        setErrorKey(errorStr)
      } else {
        setError(errorStr)
      }
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // 如果邮箱改变，重置验证码相关状态
    if (name === 'email') {
      setCodeSent(false)
      setCountdown(0)
      setFormData(prev => ({
        ...prev,
        [name]: value,
        verificationCode: '',
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
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
        
        <h2 className="modal-title">{t('auth.register')}</h2>
        
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
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder={t('auth.usernamePlaceholder')}
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_]+$"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('auth.emailPlaceholder')}
              disabled={codeSent}
            />
          </div>

          <div className="form-group">
            <label htmlFor="verificationCode">{t('auth.verificationCode')}</label>
            <div className="verification-code-container">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                placeholder={t('auth.verificationCodePlaceholder')}
                maxLength={6}
                className="verification-code-input"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0 || !formData.email}
                className="verification-code-button"
                style={{
                  backgroundColor: countdown > 0 ? 'var(--button-gray)' : 'var(--primary-color)',
                  color: 'white',
                }}
              >
                {sendingCode ? t('auth.sendingCode') : countdown > 0 ? t('auth.retryAfter', { countdown }) : t('auth.sendCode')}
              </button>
            </div>
            {codeSent && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {t('auth.codeSent')}
              </p>
            )}
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
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder={t('auth.confirmPasswordPlaceholder')}
              minLength={6}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="consent-register"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              style={{ width: '1rem', height: '1rem' }}
            />
            <label htmlFor="consent-register" style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {t('auth.consentLabel')}
            </label>
          </div>

          <button
            type="submit"
            className="modal-submit-button"
            disabled={loading}
          >
            {loading ? t('auth.registering') : t('auth.register')}
          </button>
        </form>

        <div className="modal-switch">
          <p>
            {t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="switch-link"
            >
              {t('auth.login')}
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

export default RegisterModal






