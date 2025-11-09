import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaComments, FaSearch, FaPlus, FaUserCircle } from 'react-icons/fa'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    // 搜索功能待后端实现
    if (searchQuery.trim()) {
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      console.log('搜索功能待实现:', searchQuery)
      // 可以显示提示信息
      alert('搜索功能正在开发中，敬请期待！')
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
          <FaComments className="logo-icon" />
          <span className="logo-text">REForum</span>
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
                title="创建新帖子"
              >
                <FaPlus /> 创建
              </button>
              <div className="user-menu">
                <button className="user-avatar-button" title="用户菜单">
                  <FaUserCircle className="user-avatar" />
                </button>
                <div className="user-dropdown">
                  <Link to={`/user/${user.id}`} className="dropdown-item">
                    我的资料
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    登出
                  </button>
                </div>
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

