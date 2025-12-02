import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSearch, FaPlus, FaUserCircle, FaMoon, FaSun, FaGlobeAsia } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import Inbox from './Inbox'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || 'light'
  })
  const navigate = useNavigate()
  const languageMenuRef = useRef(null)

  const languages = [
    { code: 'zh', label: '中文', symbol: '文' },
    { code: 'en', label: 'English', symbol: 'A' },
    { code: 'ja', label: '日本語', symbol: 'あ' },
  ]

  // 点击外部区域时关闭语言菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageMenu])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('theme-dark')
    } else {
      root.classList.remove('theme-dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-text">
            <span className="logo-re">RE</span>
            <span className="logo-forum">Forum</span>
          </span>
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <div className="header-actions">
          <button
            type="button"
            className="header-button theme-toggle-button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? t('header.toLight') : t('header.toDark')}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          <div 
            className="language-switcher-header"
            ref={languageMenuRef}
          >
            <button
              type="button"
              className="header-button language-toggle-button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              title="Switch language"
            >
              <FaGlobeAsia />
            </button>
            {showLanguageMenu && (
              <div className="language-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang.code)
                      setShowLanguageMenu(false)
                    }}
                  >
                    <span className="language-symbol">{lang.symbol}</span>
                    <span className="language-label">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {isAuthenticated && <Inbox />}
          {isAuthenticated ? (
            <>
              <button 
                className="header-button create-button"
                onClick={() => navigate('/create-post')}
                title={t('header.createTitle')}
              >
                <FaPlus /> {t('header.create')}
              </button>
              <div className="user-menu">
                <button 
                  className="user-avatar-button" 
                  title={t('header.userMenu')}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                >
                  <FaUserCircle className="user-avatar" />
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link 
                      to={`/user/${user.id}`} 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('header.profile')}
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }} 
                      className="dropdown-item"
                    >
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button login-button"
                onClick={() => setShowLoginModal(true)}
              >
                  {t('header.login')}
              </button>
              <button
                className="header-button register-button"
                onClick={() => setShowRegisterModal(true)}
              >
                  {t('header.register')}
              </button>
            </>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false)
            setShowRegisterModal(true)
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false)
            setShowLoginModal(true)
          }}
        />
      )}
    </header>
  )
}

export default Header

