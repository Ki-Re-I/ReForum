import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaInfoCircle, FaEnvelope, FaHistory } from 'react-icons/fa'
import { FaBug } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaHome className="nav-icon" />
          <span>{t('sidebar.home')}</span>
        </Link>
        <Link
          to="/about"
          className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
        >
          <FaInfoCircle className="nav-icon" />
          <span>{t('sidebar.about')}</span>
        </Link>
        <Link
          to="/contact"
          className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          <FaEnvelope className="nav-icon" />
          <span>{t('sidebar.contact')}</span>
        </Link>
        <Link
          to="/changelog"
          className={`nav-item ${location.pathname === '/changelog' ? 'active' : ''}`}
        >
          <FaHistory className="nav-icon" />
          <span>{t('sidebar.changelog')}</span>
        </Link>
        <Link
          to="/fixes"
          className={`nav-item ${location.pathname === '/fixes' ? 'active' : ''}`}
        >
          <FaBug className="nav-icon" />
          <span>{t('sidebar.fixes')}</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

