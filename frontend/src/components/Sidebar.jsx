import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaInfoCircle, FaEnvelope, FaHistory } from 'react-icons/fa'
import { FaBug } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { categoryAPI } from '../services/api'
import { mockCategoryAPI, mockCategories } from '../data/mockData'
import './Sidebar.css'

// 是否使用假数据（通过 .env 文件中的 VITE_USE_MOCK_DATA 环境变量控制）
// 在 frontend/.env 文件中设置 VITE_USE_MOCK_DATA=true 使用假数据，VITE_USE_MOCK_DATA=false 使用真实API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      if (USE_MOCK_DATA) {
        // 使用假数据
        const response = await mockCategoryAPI.getCategories()
        setCategories(response.data.slice(0, 5))
      } else {
        // 使用真实API
        const response = await categoryAPI.getCategories()
        setCategories(response.data.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      // 如果API失败，使用假数据作为后备
      if (!USE_MOCK_DATA) {
        setCategories(mockCategories.slice(0, 5))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [location.pathname])

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* 左侧：功能按钮 */}
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

        {/* 右侧：板块分类 */}
        <div className="sidebar-categories">
          <h3 className="categories-title">{t('right.categoriesTitle')}</h3>
          {loading ? (
            <p className="categories-loading">{t('right.loading')}</p>
          ) : categories.length === 0 ? (
            <p className="categories-empty">{t('right.emptyCategories')}</p>
          ) : (
            <div className="category-list-bubble">
              {categories.map((category) => {
                const isActive = location.pathname === '/' && 
                  new URLSearchParams(location.search).get('category') === String(category.id)
                
                return (
                  <div
                    key={category.id}
                    className={`category-bubble-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (location.pathname === '/') {
                        const currentCategory = new URLSearchParams(location.search).get('category')
                        if (currentCategory === String(category.id)) {
                          navigate('/', { replace: true })
                        } else {
                          navigate(`/?category=${category.id}`, { replace: true })
                        }
                      } else {
                        navigate(`/?category=${category.id}`)
                      }
                    }}
                  >
                    <div
                      className="category-color-dot"
                      style={{ backgroundColor: category.color || '#6366f1' }}
                    />
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">
                        {category.postCount || 0} {t('right.postsSuffix')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

