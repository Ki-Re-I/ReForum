import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { categoryAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import './RightSidebar.css'

const RightSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoryAPI.getCategories(),
        categoryAPI.getTags({ limit: 10 }),
      ])
      setCategories(categoriesRes.data.slice(0, 5))
      // 过滤掉postCount为0的标签
      setTags(tagsRes.data.filter(tag => tag.postCount > 0))
    } catch (error) {
      console.error('Failed to fetch sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // 监听自定义事件，当帖子被删除时刷新标签
    const handlePostDeleted = () => {
      fetchData()
    }
    
    window.addEventListener('postDeleted', handlePostDeleted)
    
    return () => {
      window.removeEventListener('postDeleted', handlePostDeleted)
    }
  }, [location.pathname])

  return (
    <aside className="right-sidebar">
      <div className="sidebar-card">
        <h3 className="card-title">{t('right.categoriesTitle')}</h3>
        {loading ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('right.loading')}</p>
        ) : categories.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {t('right.emptyCategories')}
          </p>
        ) : (
          <div className="category-list">
            {categories.map((category) => {
              const isActive = location.pathname === '/' && 
                new URLSearchParams(location.search).get('category') === String(category.id)
              
              return (
                <div
                  key={category.id}
                  className={`category-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/') {
                      // 如果已经在首页，检查是否点击的是已选中的分类
                      const currentCategory = new URLSearchParams(location.search).get('category')
                      if (currentCategory === String(category.id)) {
                        // 如果点击的是已选中的分类，清除筛选
                        navigate('/', { replace: true })
                      } else {
                        // 更新 URL 参数
                        navigate(`/?category=${category.id}`, { replace: true })
                      }
                    } else {
                      // 如果不在首页，跳转到首页并带上分类参数
                      navigate(`/?category=${category.id}`)
                    }
                  }}
                >
                  <div
                    className="category-color"
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

      <div className="sidebar-card">
        <h3 className="card-title">{t('right.tagsTitle')}</h3>
        {loading ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('right.loading')}</p>
        ) : tags.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {t('right.emptyTags')}
          </p>
        ) : (
          <div className="tag-list">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag-item"
                style={{ cursor: 'default', pointerEvents: 'none' }}
              >
                <span className="tag-name">#{tag.name}</span>
                <span className="tag-count">{tag.postCount || 0}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default RightSidebar

