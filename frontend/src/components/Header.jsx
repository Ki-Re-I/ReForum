import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSearch, FaPlus, FaUserCircle } from 'react-icons/fa'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
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
            placeholder="搜索帖子、用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <button 
                className="header-button create-button"
                onClick={() => navigate('/create-post')}
                title="发布新帖子"
              >
                <FaPlus /> 发布
              </button>
              <div className="user-menu">
                <button 
                  className="user-avatar-button" 
                  title="用户菜单"
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
                      我的资料
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }} 
                      className="dropdown-item"
                    >
                      登出
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
                登录
              </button>
              <button
                className="header-button register-button"
                onClick={() => setShowRegisterModal(true)}
              >
                注册
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

