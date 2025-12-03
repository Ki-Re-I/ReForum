import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSearch, FaPlus, FaUserCircle, FaMoon, FaSun, FaGlobeAsia, FaThLarge } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import Inbox from './Inbox'
import ThemeColorPicker from './ThemeColorPicker'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [isClosingActions, setIsClosingActions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(() => new Date())
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

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setShowActionsMenu(false)
      setIsClosingActions(false)
    }
  }, [isMobile])

  // 点击外部区域时关闭语言菜单（桌面端）
  useEffect(() => {
    if (!showLanguageMenu || isMobile) return
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }

      document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageMenu, isMobile])

  // 移动端打开语言菜单时禁用滚动
  useEffect(() => {
    if (!showLanguageMenu || !isMobile) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showLanguageMenu, isMobile])

  useEffect(() => {
    if (!showActionsMenu || !isMobile) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showActionsMenu, isMobile])

  const localeMap = {
    zh: 'zh-CN',
    en: 'en-US',
    ja: 'ja-JP',
  }

  const currentLocale = localeMap[language] || 'en-US'

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 统一日期显示格式：YYYY-MM-DD（与语言无关，始终同一样式）
  const formattedDate = [
    currentTime.getFullYear(),
    String(currentTime.getMonth() + 1).padStart(2, '0'),
    String(currentTime.getDate()).padStart(2, '0'),
  ].join('-')
  const timeString = currentTime.toLocaleTimeString(currentLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const languageMenuContent = (
    <div className="language-menu-list">
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
  )

  const languageOverlay = showLanguageMenu && isMobile
    ? createPortal(
        <div className="language-overlay" onClick={() => setShowLanguageMenu(false)}>
          <div className="language-modal" onClick={(e) => e.stopPropagation()}>
            <div className="language-modal-header">
              <span>{t('header.languageTitle')}</span>
              <button
                type="button"
                className="language-modal-close"
                onClick={() => setShowLanguageMenu(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {languageMenuContent}
          </div>
        </div>,
        document.body
      )
    : null

  const closeActionsMenu = () => {
    if (!showActionsMenu) return
    setIsClosingActions(true)
    setTimeout(() => {
      setShowActionsMenu(false)
      setIsClosingActions(false)
    }, 200)
  }

  const renderToolsGroup = (variant = 'inline') => {
    const showLabels = variant !== 'inline'
    return (
      <div
        className={`header-actions-group header-actions-group-tools ${
          showLabels ? 'header-actions-group-mobile' : ''
        }`}
      >
        <ThemeColorPicker showLabel={showLabels} />
        <button
          type="button"
          className={`header-button theme-toggle-button ${showLabels ? 'with-label' : ''}`}
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? t('header.toLight') : t('header.toDark')}
        >
          {showLabels && (
            <span className="action-button-label">
              {theme === 'dark' ? t('header.lightLabel') : t('header.darkLabel')}
            </span>
          )}
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
        <div
          className={`language-switcher-header ${showLabels ? 'with-label' : ''}`}
          ref={!isMobile ? languageMenuRef : null}
        >
          <button
            type="button"
            className={`header-button language-toggle-button ${showLabels ? 'with-label' : ''}`}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            title={t('header.languageTitle')}
          >
            {showLabels && <span className="action-button-label">{t('header.languageTitle')}</span>}
            <FaGlobeAsia />
          </button>
          {!isMobile && showLanguageMenu && <div className="language-menu">{languageMenuContent}</div>}
        </div>
        {languageOverlay}
        {isAuthenticated && <Inbox showLabel={showLabels} />}
      </div>
    )
  }

  const renderPrimaryGroup = (variant = 'inline') => {
    const showLabels = variant !== 'inline'
    return (
      <div
        className={`header-actions-group header-actions-group-primary ${
          showLabels ? 'header-actions-group-mobile' : ''
        }`}
      >
        {isAuthenticated ? (
          <>
            <button
              className={`header-button create-button ${showLabels ? 'with-label' : ''}`}
              onClick={() => {
                navigate('/create-post')
                if (isMobile) closeActionsMenu()
              }}
              title={t('header.createTitle')}
            >
              {showLabels ? (
                <>
                  <span className="action-button-label">{t('header.create')}</span>
                  <FaPlus />
                </>
              ) : (
                <>
                  <FaPlus />
                  <span className="create-button-label">{t('header.create')}</span>
                </>
              )}
            </button>
            <div className={`user-menu ${showLabels ? 'with-label' : ''}`}>
              <button
                className={`user-avatar-button ${showLabels ? 'with-label' : ''}`}
                title={t('header.userMenu')}
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
              >
                {showLabels && <span className="action-button-label">{t('header.userMenu')}</span>}
                <FaUserCircle className="user-avatar" />
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link
                    to={`/user/${user.id}`}
                    className="dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false)
                      if (isMobile) closeActionsMenu()
                    }}
                  >
                    {t('header.profile')}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      handleLogout()
                      if (isMobile) closeActionsMenu()
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
              onClick={() => {
                setShowLoginModal(true)
                if (isMobile) closeActionsMenu()
              }}
            >
              {t('header.login')}
            </button>
            <button
              className="header-button register-button"
              onClick={() => {
                setShowRegisterModal(true)
                if (isMobile) closeActionsMenu()
              }}
            >
              {t('header.register')}
            </button>
          </>
        )}
      </div>
    )
  }

  const renderActionsLayout = (variant = 'inline') => (
    <div className={`header-actions-row ${variant === 'modal' ? 'stacked' : ''}`}>
      {renderToolsGroup(variant)}
      {renderPrimaryGroup(variant)}
    </div>
  )

  const actionsOverlay = (showActionsMenu || isClosingActions) && isMobile
    ? createPortal(
        <div
          className={`actions-overlay ${isClosingActions ? 'closing' : 'opening'}`}
          onClick={closeActionsMenu}
        >
          <div className="actions-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="actions-modal-close standalone"
              onClick={closeActionsMenu}
              aria-label="Close"
            >
              ×
            </button>
            {renderActionsLayout('modal')}
          </div>
        </div>,
        document.body
      )
    : null

  const actionsToggle =
    isMobile &&
    createPortal(
      <div className="actions-toggle-wrapper">
        <button
          type="button"
          className="header-button actions-toggle-button"
          onClick={() => {
            if (showActionsMenu) {
              closeActionsMenu()
            } else {
              setShowActionsMenu(true)
            }
          }}
          title={t('header.actionsTitle')}
        >
          <FaThLarge />
        </button>
        {actionsOverlay}
      </div>,
      document.body
    )

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
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
          </div>

          <div className="header-center">
            <div className="date-block">
              <span className="date-year-month">{formattedDate}</span>
            </div>
            <span className="time-block">{timeString}</span>
          </div>

          {!isMobile && renderActionsLayout()}
        </div>
      </header>

      {actionsToggle}

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
    </>
  )
}

export default Header

