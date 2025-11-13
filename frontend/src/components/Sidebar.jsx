import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaInfoCircle, FaEnvelope, FaHistory } from 'react-icons/fa'
import { FaBug } from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaHome className="nav-icon" />
          <span>首页</span>
        </Link>
        <Link
          to="/about"
          className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
        >
          <FaInfoCircle className="nav-icon" />
          <span>关于我们</span>
        </Link>
        <Link
          to="/contact"
          className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          <FaEnvelope className="nav-icon" />
          <span>联系我们</span>
        </Link>
        <Link
          to="/changelog"
          className={`nav-item ${location.pathname === '/changelog' ? 'active' : ''}`}
        >
          <FaHistory className="nav-icon" />
          <span>更新日志</span>
        </Link>
        <Link
          to="/fixes"
          className={`nav-item ${location.pathname === '/fixes' ? 'active' : ''}`}
        >
          <FaBug className="nav-icon" />
          <span>问题修复</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

