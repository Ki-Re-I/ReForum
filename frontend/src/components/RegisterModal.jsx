import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
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
  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

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

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
    if (result.success) {
      onClose()
      navigate('/')
    } else {
      // 存储错误键或原始错误消息
      if (result.error?.startsWith('error.') || result.error?.startsWith('auth.error.')) {
        setErrorKey(result.error)
      } else {
        setError(result.error)
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">注册</h2>
        
        <p className="modal-agreement">
          继续操作即表示您同意我们的
          <a href="/terms" target="_blank" rel="noopener noreferrer">用户协议</a>并确认您了解
          <a href="/privacy" target="_blank" rel="noopener noreferrer">隐私政策</a>。
        </p>

        {(error || errorKey) && (
          <div className="modal-error">
            {errorKey ? t(errorKey) : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="username">用户名 *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="3-20个字符，仅字母、数字和下划线"
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_]+$"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              disabled={codeSent}
            />
          </div>

          <div className="form-group">
            <label htmlFor="verificationCode">验证码 *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                placeholder="请输入6位验证码"
                maxLength={6}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0 || !formData.email}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: countdown > 0 ? 'var(--button-gray)' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: (sendingCode || countdown > 0 || !formData.email) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
              </button>
            </div>
            {codeSent && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                验证码已发送到您的邮箱，有效期5分钟
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">密码 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="至少6个字符"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="再次输入密码"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="modal-submit-button"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="modal-switch">
          <p>
            已有账户？{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="switch-link"
            >
              登录
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal






