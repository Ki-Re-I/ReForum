import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import { useLanguage } from '../context/LanguageContext'
import { debounce } from '../utils/debounce'
import './Home.css'

// 按日期分组帖子
const groupPostsByDate = (posts) => {
  const grouped = {}
  posts.forEach(post => {
    const date = new Date(post.createdAt)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(post)
  })
  
  return grouped
}

// 生成周视图数据
const generateWeekView = (year, month, day, postsByDate) => {
  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // 使用传入的年月日，如果没有则使用当前日期
    let baseDate
    if (day && year && month !== undefined) {
      baseDate = new Date(year, month, day)
      // 检查日期是否有效
      if (isNaN(baseDate.getTime())) {
        baseDate = new Date()
      }
    } else {
      baseDate = new Date()
    }
    
    // 获取该日期所在周的第一天（周日）
    const firstDayOfWeek = new Date(baseDate)
    firstDayOfWeek.setDate(baseDate.getDate() - baseDate.getDay())
    
    const week = []
    
    // 生成一周的日期（7天）
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek)
      date.setDate(firstDayOfWeek.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const isToday = dateStr === todayStr
      const postCount = postsByDate[dateStr]?.length || 0
      const hasPosts = postCount > 0
      
      week.push({
        date: dateStr,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isToday,
        hasPosts,
        postCount
      })
    }
    
    return week
  } catch (error) {
    console.error('Error generating week view:', error)
    return []
  }
}

// 生成月视图数据
const generateMonthView = (year, month, postsByDate) => {
  try {
    // 验证年月参数
    let validYear = year
    let validMonth = month
    if (validYear === undefined || validMonth === undefined || isNaN(validYear) || isNaN(validMonth)) {
      const now = new Date()
      validYear = now.getFullYear()
      validMonth = now.getMonth()
    }
    
    let firstDay = new Date(validYear, validMonth, 1)
    let lastDay = new Date(validYear, validMonth + 1, 0)
    
    // 检查日期是否有效
    if (isNaN(firstDay.getTime()) || isNaN(lastDay.getTime())) {
      const now = new Date()
      validYear = now.getFullYear()
      validMonth = now.getMonth()
      firstDay = new Date(validYear, validMonth, 1)
      lastDay = new Date(validYear, validMonth + 1, 0)
    }
    
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const calendar = []
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // 填充空白（上个月的日期）
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null)
    }
    
    // 填充当前月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(validYear, validMonth, day)
      const dateStr = date.toISOString().split('T')[0]
      const isToday = dateStr === todayStr
      const postCount = postsByDate[dateStr]?.length || 0
      const hasPosts = postCount > 0
      
      calendar.push({
        date: dateStr,
        day,
        isToday,
        hasPosts,
        postCount
      })
    }
    
    return calendar
  } catch (error) {
    console.error('Error generating month view:', error)
    return []
  }
}

// 格式化日期显示（需要传入 t 函数和 language）
const formatDateDisplay = (dateString, t, language = 'en') => {
  try {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    if (dateStr === todayStr) {
      return t('home.today')
    } else if (dateStr === yesterdayStr) {
      return t('home.yesterday')
    } else {
      // 根据语言显示月-日格式
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      if (language === 'zh' || language === 'ja') {
        return `${month}月${day}日`
      } else {
        // 英文格式：Month Day
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${monthNames[month - 1]} ${day}`
      }
    }
  } catch {
    return ''
  }
}

// 计算热门分数：红心数 × 浏览数 + 评论数 × 2 + (有评论则加10，没有评论不加)
const calculateHotScore = (post) => {
  const likeCount = post.likeCount || 0
  const viewCount = post.viewCount || 0
  const commentCount = post.commentCount || 0
  const baseScore = likeCount * viewCount + commentCount * 2
  // 有评论的帖子加10，没有评论的帖子不加
  return commentCount > 0 ? baseScore + 10 : baseScore
}

const Home = () => {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([]) // 用于日期分组的所有帖子
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [sort, setSort] = useState('time')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState(null)
  
  // 初始化日历日期状态，添加错误处理
  const getInitialDate = () => {
    try {
      const now = new Date()
      if (isNaN(now.getTime())) {
        return { month: 0, year: 2024, day: 1 }
      }
      return {
        month: now.getMonth(),
        year: now.getFullYear(),
        day: now.getDate()
      }
    } catch {
      return { month: 0, year: 2024, day: 1 }
    }
  }
  
  const initialDate = getInitialDate()
  const [calendarMonth, setCalendarMonth] = useState(initialDate.month)
  const [calendarYear, setCalendarYear] = useState(initialDate.year)
  const [calendarDay, setCalendarDay] = useState(initialDate.day) // 用于周视图的基准日期
  const [calendarView, setCalendarView] = useState('week') // 'week' 或 'month'
  const lastRequestTimeRef = useRef(0)
  const MIN_REQUEST_INTERVAL = 500 // 最小请求间隔：500毫秒

  // 当 URL 参数变化时，更新选中的分类和日期
  useEffect(() => {
    const categoryId = searchParams.get('category')
    const date = searchParams.get('date')
    const sortParam = searchParams.get('sort')
    
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId, 10))
    } else {
      setSelectedCategory(null)
    }
    
    if (sortParam && (sortParam === 'time' || sortParam === 'hot')) {
      setSort(sortParam)
    }
    
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchParams])

  // 获取所有帖子用于日期分组（不限制数量）
  const fetchAllPostsForGrouping = useCallback(async () => {
    try {
      const params = {
        page: 1,
        limit: 1000, // 获取足够多的帖子用于日期分组
        sort: 'time',
      }
      if (selectedCategory) {
        params.category = selectedCategory
      }

      const response = await postAPI.getPosts(params)
      setAllPosts(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch all posts for grouping:', error)
      setAllPosts([])
    }
  }, [selectedCategory])

  const fetchPosts = useCallback(async () => {
    // 节流：确保请求间隔至少为 MIN_REQUEST_INTERVAL 毫秒
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current
    
    // 创建一个实际的请求函数
    const performRequest = async () => {
      lastRequestTimeRef.current = Date.now()
      setLoading(true)
      try {
        // 处理日期筛选
        const dateParam = searchParams.get('date')
        
        const params = {
          page: pagination.page,
          // 如果有日期筛选，显示该日期的所有帖子；否则最新和热门模式都只显示3条
          limit: dateParam ? pagination.limit : 3,
          sort,
        }
        if (selectedCategory) {
          params.category = selectedCategory
        }
        if (dateParam) {
          params.date = dateParam
        }

        const response = await postAPI.getPosts(params)
        let processedPosts = response.data.data || []
        
        // 如果是热门模式，需要获取更多帖子来计算热门分数并排序
        if (sort === 'hot' && !date) {
          // 获取更多帖子用于热门排序（获取前50条来计算）
          const hotParams = {
            page: 1,
            limit: 50,
            sort: 'time', // 先按时间获取
          }
          if (selectedCategory) {
            hotParams.category = selectedCategory
          }
          
          try {
            const hotResponse = await postAPI.getPosts(hotParams)
            const allPosts = hotResponse.data.data || []
            
            // 计算热门分数并排序
            processedPosts = allPosts
              .map(post => ({
                ...post,
                hotScore: calculateHotScore(post)
              }))
              .sort((a, b) => b.hotScore - a.hotScore)
              .slice(0, 3) // 只取前3条
          } catch (error) {
            console.error('Failed to fetch posts for hot sorting:', error)
            // 如果失败，使用原来的数据
            processedPosts = processedPosts
              .map(post => ({
                ...post,
                hotScore: calculateHotScore(post)
              }))
              .sort((a, b) => b.hotScore - a.hotScore)
          }
        } else if (sort === 'hot' && date) {
          // 有日期筛选时，对当前日期的帖子按热门分数排序
          processedPosts = processedPosts
            .map(post => ({
              ...post,
              hotScore: calculateHotScore(post)
            }))
            .sort((a, b) => b.hotScore - a.hotScore)
        }
        
        setPosts(processedPosts)
        setPagination(response.data.pagination || pagination)
        setError(null) // 清除之前的错误
        
        // 同时获取所有帖子用于日期分组
        await fetchAllPostsForGrouping()
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        // 设置更详细的错误信息（存储错误键而不是翻译后的文本）
        if (!error.response) {
          // 网络错误，后端可能未运行
          setError({
            type: 'network',
            messageKey: 'error.cannotConnect',
            detail: error.message
          })
        } else if (error.response.status === 500) {
          // 服务器内部错误
          setError({
            type: 'server',
            messageKey: 'error.serverError',
            detailKey: error.response.data?.message ? null : 'error.serverInternalError',
            detail: error.response.data?.message || null
          })
        } else {
          setError({
            type: 'unknown',
            messageKey: 'error.loadPostsFailed',
            detail: error.response.data?.message || error.message
          })
        }
        setPosts([]) // 清空帖子列表
        setAllPosts([])
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
  }, [pagination.page, pagination.limit, sort, selectedCategory, searchParams, t, fetchAllPostsForGrouping])

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

  // 处理日期点击
  const handleDateClick = (date) => {
    const params = new URLSearchParams(searchParams)
    params.set('date', date)
    params.set('sort', sort)
    params.set('page', '1') // 重置到第一页
    navigate(`/?${params.toString()}`)
  }

  // 获取当前选中的日期
  const selectedDate = searchParams.get('date')

  // 获取日期分组
  const postsByDate = groupPostsByDate(allPosts)
  
  // 生成日历数据
  const calendarData = calendarView === 'week' 
    ? generateWeekView(calendarYear, calendarMonth, calendarDay, postsByDate)
    : generateMonthView(calendarYear, calendarMonth, postsByDate)
  
  // 月份名称 - 简化版本
  const monthNames = {
    zh: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  }
  
  const weekDays = {
    zh: ['日', '一', '二', '三', '四', '五', '六'],
    en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    ja: ['日', '月', '火', '水', '木', '金', '土']
  }
  
  const currentWeekDays = weekDays[language] || weekDays.en
  
  // 获取当前显示的月份名称（周视图显示当前周所在的月份）
  const getCurrentMonthName = () => {
    if (calendarView === 'week' && calendarData.length > 0) {
      const firstDate = calendarData[0]
      return monthNames[language]?.[firstDate.month] || monthNames.en[firstDate.month]
    }
    return monthNames[language]?.[calendarMonth] || monthNames.en[calendarMonth]
  }
  
  const currentMonthName = getCurrentMonthName()
  
  // 切换周/月
  const changePeriod = (direction) => {
    if (calendarView === 'week') {
      // 周视图：切换周
      const currentDate = new Date(calendarYear, calendarMonth, calendarDay)
      const daysToAdd = direction === 'next' ? 7 : -7
      currentDate.setDate(currentDate.getDate() + daysToAdd)
      setCalendarYear(currentDate.getFullYear())
      setCalendarMonth(currentDate.getMonth())
      setCalendarDay(currentDate.getDate())
    } else {
      // 月视图：切换月
      if (direction === 'prev') {
        if (calendarMonth === 0) {
          setCalendarMonth(11)
          setCalendarYear(calendarYear - 1)
        } else {
          setCalendarMonth(calendarMonth - 1)
        }
      } else {
        if (calendarMonth === 11) {
          setCalendarMonth(0)
          setCalendarYear(calendarYear + 1)
        } else {
          setCalendarMonth(calendarMonth + 1)
        }
      }
    }
  }
  
  // 回到当前周/月
  const goToCurrent = () => {
    const now = new Date()
    setCalendarMonth(now.getMonth())
    setCalendarYear(now.getFullYear())
    setCalendarDay(now.getDate())
  }
  
  // 切换视图时，如果切换到周视图，使用当前日期
  const toggleView = () => {
    if (calendarView === 'month') {
      // 从月视图切换到周视图，使用当前日期
      const now = new Date()
      setCalendarDay(now.getDate())
    }
    setCalendarView(prev => prev === 'week' ? 'month' : 'week')
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

      {/* 日历视图 */}
      {!loading && !error && (
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="calendar-title">{t('home.viewByDate')}</div>
            <div className="calendar-controls">
              <button 
                className="calendar-nav-btn"
                onClick={() => changePeriod('prev')}
                aria-label={calendarView === 'week' ? 'Previous week' : 'Previous month'}
              >
                ‹
              </button>
              <button 
                className="calendar-month-btn"
                onClick={goToCurrent}
              >
                {calendarView === 'week' ? `${currentMonthName}` : `${currentMonthName} ${calendarYear}`}
              </button>
              <button 
                className="calendar-nav-btn"
                onClick={() => changePeriod('next')}
                aria-label={calendarView === 'week' ? 'Next week' : 'Next month'}
              >
                ›
              </button>
              <button 
                className="calendar-view-toggle"
                onClick={toggleView}
                title={calendarView === 'week' ? t('home.expandMonth') : t('home.collapseWeek')}
                aria-label={calendarView === 'week' ? 'Expand to month view' : 'Collapse to week view'}
              >
                {calendarView === 'week' ? '⤢' : '⤡'}
              </button>
            </div>
          </div>
          <div className={`calendar-grid ${calendarView === 'week' ? 'week-view' : 'month-view'}`}>
            {/* 星期标题 */}
            <div className="calendar-weekdays">
              {currentWeekDays.map((day, index) => (
                <div key={index} className="calendar-weekday">{day}</div>
              ))}
            </div>
            {/* 日期网格 */}
            <div className="calendar-days">
              {calendarView === 'week'
                ? // 周视图：只显示一行
                  calendarData.map((dateInfo) => {
                    const isSelected = selectedDate
                      ? selectedDate === dateInfo.date
                      : dateInfo.isToday
                    return (
                      <button
                        key={dateInfo.date}
                        className={`calendar-day ${dateInfo.isToday ? 'today' : ''} ${
                          dateInfo.hasPosts ? 'has-posts' : ''
                        } ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDateClick(dateInfo.date)}
                        title={
                          dateInfo.hasPosts
                            ? `${dateInfo.postCount} ${t('home.postsCount').replace(
                                '{count}',
                                dateInfo.postCount
                              )}`
                            : ''
                        }
                      >
                        <span className="calendar-day-number">{dateInfo.day}</span>
                        {dateInfo.hasPosts && (
                          <span className="calendar-day-badge">{dateInfo.postCount}</span>
                        )}
                      </button>
                    )
                  })
                : // 月视图：显示完整月份
                  calendarData.map((dateInfo, index) => {
                    if (!dateInfo) {
                      return <div key={`empty-${index}`} className="calendar-day empty"></div>
                    }
                    const isSelected = selectedDate
                      ? selectedDate === dateInfo.date
                      : dateInfo.isToday
                    return (
                      <button
                        key={dateInfo.date}
                        className={`calendar-day ${dateInfo.isToday ? 'today' : ''} ${
                          dateInfo.hasPosts ? 'has-posts' : ''
                        } ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDateClick(dateInfo.date)}
                        title={
                          dateInfo.hasPosts
                            ? `${dateInfo.postCount} ${t('home.postsCount').replace(
                                '{count}',
                                dateInfo.postCount
                              )}`
                            : ''
                        }
                      >
                        <span className="calendar-day-number">{dateInfo.day}</span>
                        {dateInfo.hasPosts && (
                          <span className="calendar-day-badge">{dateInfo.postCount}</span>
                        )}
                      </button>
                    )
                  })}
            </div>
          </div>
        </div>
      )}

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
        ) : error ? (
          <div className="error-state" style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h3 style={{ color: '#856404', marginBottom: '0.5rem' }}>⚠️ {t('error.loadFailed')}</h3>
            <p style={{ color: '#856404', marginBottom: '0.5rem' }}>
              {error.messageKey ? t(error.messageKey) : error.message}
            </p>
            {error.detail && (
              <p style={{ fontSize: '0.85rem', color: '#856404', marginBottom: '1rem' }}>
                {t('error.detail')} {error.detailKey ? t(error.detailKey) : error.detail}
              </p>
            )}
            <button
              onClick={() => {
                setError(null)
                fetchPosts()
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {t('error.retry')}
            </button>
            {error.type === 'network' && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#856404' }}>
                <p>{t('error.networkHint')}</p>
                <p style={{ marginTop: '0.5rem' }}>
                  {t('error.checkSteps')}
                  <br />{t('error.checkStep1')}
                  <br />{t('error.checkStep2')}
                  <br />{t('error.checkStep3')}
                </p>
              </div>
            )}
          </div>
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
            {/* 最新模式只显示3条，不显示加载更多 */}
            {sort !== 'time' && pagination.totalPages > pagination.page && (
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

