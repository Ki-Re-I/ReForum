import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaHistory,
  FaShieldAlt,
  FaBug,
  FaChevronDown,
  FaThList,
  FaLayerGroup,
  FaFileContract,
} from 'react-icons/fa'
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
  const { t, getCategoryName } = useLanguage()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })
  const [navExpanded, setNavExpanded] = useState(!isMobile)
  const [categoryExpanded, setCategoryExpanded] = useState(!isMobile)
  const [policyExpanded, setPolicyExpanded] = useState(!isMobile)

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

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setNavExpanded(false)
      setCategoryExpanded(false)
      setPolicyExpanded(false)
    } else {
      setNavExpanded(true)
      setCategoryExpanded(true)
      setPolicyExpanded(true)
    }
  }, [isMobile])

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-accordion">
          <button
            type="button"
            className="sidebar-accordion-header"
            onClick={() => setNavExpanded((prev) => !prev)}
            aria-expanded={navExpanded}
            aria-controls="sidebar-nav-section"
          >
            <div className="sidebar-accordion-label">
              <FaThList className="accordion-leading-icon" />
              <span>{t('sidebar.navToggle')}</span>
            </div>
            <FaChevronDown className={`sidebar-accordion-icon ${navExpanded ? 'open' : ''}`} />
          </button>
          <div
            id="sidebar-nav-section"
            className={`sidebar-accordion-content ${navExpanded ? 'expanded' : 'collapsed'}`}
          >
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
          </div>
        </div>

        <div className="sidebar-accordion">
            <button
              type="button"
              className="sidebar-accordion-header"
              onClick={() => setCategoryExpanded((prev) => !prev)}
              aria-expanded={categoryExpanded}
              aria-controls="sidebar-category-section"
            >
              <div className="sidebar-accordion-label">
                <FaLayerGroup className="accordion-leading-icon" />
                <span>{t('right.categoriesTitle')}</span>
              </div>
            <FaChevronDown className={`sidebar-accordion-icon ${categoryExpanded ? 'open' : ''}`} />
            </button>
          <div
            id="sidebar-category-section"
            className={`sidebar-accordion-content ${categoryExpanded ? 'expanded' : 'collapsed'}`}
          >
            <div className="sidebar-categories">
              {loading ? (
                <div className="categories-skeleton">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="category-skeleton-item">
                      <div className="skeleton-dot"></div>
                      <div className="skeleton-category-info">
                        <div className="skeleton-line skeleton-line-sm" style={{ width: '80px', marginBottom: '0.25rem' }}></div>
                        <div className="skeleton-line skeleton-line-sm" style={{ width: '60px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="categories-empty">{t('right.emptyCategories')}</p>
              ) : (
                <div className="category-list-bubble">
                  {categories.map((category) => {
                    const isActive =
                      location.pathname === '/' &&
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
                          {/* {getCategoryIcon(getCategoryName(category.name))} */}
                          <span className="category-name">{getCategoryName(category.name)}</span>
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
        </div>

        <div className="sidebar-accordion">
          <button
            type="button"
            className="sidebar-accordion-header"
            onClick={() => setPolicyExpanded((prev) => !prev)}
            aria-expanded={policyExpanded}
            aria-controls="sidebar-policy-section"
          >
            <div className="sidebar-accordion-label">
              <FaShieldAlt className="accordion-leading-icon" />
              <span>{t('sidebar.policies')}</span>
            </div>
            <FaChevronDown className={`sidebar-accordion-icon ${policyExpanded ? 'open' : ''}`} />
          </button>
          <div
            id="sidebar-policy-section"
            className={`sidebar-accordion-content ${policyExpanded ? 'expanded' : 'collapsed'}`}
          >
            <nav className="sidebar-nav">
              <Link
                to="/terms"
                className={`nav-item ${location.pathname === '/terms' ? 'active' : ''}`}
              >
                <FaFileContract className="nav-icon" />
                <span>{t('sidebar.terms')}</span>
              </Link>
              <Link
                to="/privacy"
                className={`nav-item ${location.pathname === '/privacy' ? 'active' : ''}`}
              >
                <FaShieldAlt className="nav-icon" />
                <span>{t('sidebar.privacy')}</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

