import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSearch, FaPlus, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || 'light'
  })
  const navigate = useNavigate()

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
            <span>{theme === 'dark' ? t('header.lightLabel') : t('header.darkLabel')}</span>
          </button>
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

