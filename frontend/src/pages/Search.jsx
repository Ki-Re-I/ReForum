import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import { useLanguage } from '../context/LanguageContext'
import { debounce } from '../utils/debounce'
import './Home.css'

const Search = () => {
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
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useLanguage()
  const lastRequestTimeRef = useRef(0)
  const MIN_REQUEST_INTERVAL = 500 // 最小请求间隔：500毫秒

  // 从 URL 参数获取搜索关键词
  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchParams])

  const fetchPosts = useCallback(async () => {
    if (!searchQuery.trim()) {
      setPosts([])
      setLoading(false)
      return
    }

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
          search: searchQuery,
        }

        const response = await postAPI.getPosts(params)
        setPosts(response.data.data || [])
        setPagination(response.data.pagination || pagination)
      } catch (error) {
        console.error('Failed to fetch search results:', error)
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
  }, [searchQuery, pagination.page, pagination.limit, sort])

  // 使用防抖，避免频繁请求
  const debouncedFetchPosts = useCallback(
    debounce(() => {
      fetchPosts()
    }, 300),
    [fetchPosts]
  )

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchPosts()
    } else {
      setPosts([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, sort, searchQuery])

  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPagination({ ...pagination, page: 1 })
  }

  return (
    <div className="home-page">
      <div className="posts-header">
        <div className="search-results-header">
          <h2>{t('search.title')}</h2>
          {searchQuery && (
            <p className="search-query">
              {t('search.keywordPrefix')}
              "{searchQuery}"
            </p>
          )}
        </div>
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
          <>
            {[1, 2, 3].map((index) => (
              <article key={index} className="post-card post-card-skeleton">
                <div className="post-content">
                  <div className="post-skeleton-header">
                    <div className="skeleton-line skeleton-line-sm" />
                    <div className="skeleton-line skeleton-line-sm" />
                  </div>
                  <div className="skeleton-line skeleton-line-lg" />
                  <div className="skeleton-line skeleton-line-md" />
                  <div className="skeleton-line skeleton-line-md skeleton-line-fade" />
                </div>
              </article>
            ))}
          </>
        ) : !searchQuery ? (
          <div className="empty-state">
            <p>{t('search.enterKeyword')}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>{t('search.noResultsTitle')}</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              {t('search.noResultsDesc')}
            </p>
          </div>
        ) : (
          <>
            <div className="search-results-count">
              {t('search.resultsPrefix')}
              {pagination.total}
              {t('search.resultsSuffix')}
            </div>
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

export default Search

