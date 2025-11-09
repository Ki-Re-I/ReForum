import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
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
      </nav>
    </aside>
  )
}

export default Sidebar

