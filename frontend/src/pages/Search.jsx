import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import { useLanguage } from '../context/LanguageContext'
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

  // 从 URL 参数获取搜索关键词
  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchParams])

  useEffect(() => {
    if (searchQuery) {
      fetchPosts()
    } else {
      setPosts([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, sort, searchQuery])

  const fetchPosts = async () => {
    if (!searchQuery.trim()) {
      setLoading(false)
      return
    }

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
          <div className="loading">{t('search.loading')}</div>
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

