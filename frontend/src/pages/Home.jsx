import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import { useLanguage } from '../context/LanguageContext'
import { debounce } from '../utils/debounce'
import './Home.css'

const Home = () => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [sort, setSort] = useState('time')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const lastRequestTimeRef = useRef(0)
  const MIN_REQUEST_INTERVAL = 500 // 最小请求间隔：500毫秒

  // 当 URL 参数变化时，更新选中的分类
  useEffect(() => {
    const categoryId = searchParams.get('category')
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId, 10))
    } else {
      setSelectedCategory(null)
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchParams])

  const fetchPosts = useCallback(async () => {
    // 节流：确保请求间隔至少为 MIN_REQUEST_INTERVAL 毫秒
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current
    
    // 创建一个实际的请求函数
    const performRequest = async () => {
      lastRequestTimeRef.current = Date.now()
      setLoading(true)
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sort,
        }
        if (selectedCategory) {
          params.category = selectedCategory
        }

        const response = await postAPI.getPosts(params)
        setPosts(response.data.data || [])
        setPagination(response.data.pagination || pagination)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    // 如果距离上次请求太近，延迟执行
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      setTimeout(() => {
        performRequest()
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      return
    }

    // 否则立即执行
    performRequest()
  }, [pagination.page, pagination.limit, sort, selectedCategory])

  // 使用防抖，避免频繁请求
  const debouncedFetchPosts = useCallback(
    debounce(() => {
      fetchPosts()
    }, 300),
    [fetchPosts]
  )

  useEffect(() => {
    debouncedFetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, sort, selectedCategory])

  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPagination({ ...pagination, page: 1 })
  }

  return (
    <div className="home-page">
      <div className="posts-header">
        <div className="sort-buttons">
          <button
            className={`sort-button ${sort === 'time' ? 'active' : ''}`}
            onClick={() => handleSortChange('time')}
          >
            {t('home.latest')}
          </button>
          <button
            className={`sort-button ${sort === 'hot' ? 'active' : ''}`}
            onClick={() => handleSortChange('hot')}
          >
            {t('home.hot')}
          </button>
        </div>
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="loading">{t('home.loading')}</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>{t('home.emptyTitle')}</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              {t('home.emptyDesc')}
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {pagination.totalPages > pagination.page && (
              <div className="load-more-container">
                <button
                  className="load-more-button"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                >
                  {t('home.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home

