import React, { useEffect, useState } from 'react'
import { categoryAPI } from '../services/api'
import './RightSidebar.css'

const RightSidebar = () => {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          categoryAPI.getCategories(),
          categoryAPI.getTags({ limit: 10 }),
        ])
        setCategories(categoriesRes.data.slice(0, 5))
        setTags(tagsRes.data)
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <aside className="right-sidebar">
      <div className="sidebar-card">
        <h3 className="card-title">版块分类</h3>
        {loading ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>加载中...</p>
        ) : categories.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            暂无数据
            <br />
            <span style={{ fontSize: '0.8rem' }}>后端服务可能未运行</span>
          </p>
        ) : (
          <div className="category-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-item"
                style={{ cursor: 'default' }}
              >
                <div
                  className="category-color"
                  style={{ backgroundColor: category.color || '#6366f1' }}
                />
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {category.postCount || 0} 帖子
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-card">
        <h3 className="card-title">标签</h3>
        {loading ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>加载中...</p>
        ) : tags.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            暂无数据
            <br />
            <span style={{ fontSize: '0.8rem' }}>后端服务可能未运行</span>
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

