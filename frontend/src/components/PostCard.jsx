import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { postAPI } from '../services/api'
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import { isOfficialTag, getOfficialTagText } from '../utils/tagUtils'
import { updateTask } from '../utils/dailyTasks'
import LevelBadge from '../components/LevelBadge'
import './PostCard.css'

const PostCard = ({ post }) => {
  const { isAuthenticated } = useAuth()
  const { t, getCategoryName, language } = useLanguage()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [liking, setLiking] = useState(false)
  
  // 获取日期格式化locale
  const getDateLocale = () => {
    switch (language) {
      case 'zh':
        return zhCN
      case 'ja':
        return ja
      default:
        return enUS
    }
  }

  useEffect(() => {
    // 如果后端返回了liked状态，直接使用
    if (post.liked !== undefined) {
      setLiked(post.liked)
    } else if (isAuthenticated && post.id) {
      checkLikeStatus()
    }
  }, [isAuthenticated, post.id, post.liked])

  const formatDate = (dateString) => {
    try {
      if (!dateString) return t('comment.unknownTime')
      
      const date = new Date(dateString)
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return t('comment.unknownTime')
      }
      
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: getDateLocale(),
      })
    } catch {
      return t('comment.unknownTime')
    }
  }
  
  // 格式化发布日期（完整日期）
  const formatPublishDate = (dateString) => {
    try {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return ''
      }
      
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      if (language === 'zh') {
        return `${year}年${month}月${day}日`
      } else if (language === 'ja') {
        return `${year}年${month}月${day}日`
      } else {
        // 英文格式：Month Day, Year
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${monthNames[month - 1]} ${day}, ${year}`
      }
    } catch {
      return ''
    }
  }

  const checkLikeStatus = async () => {
    if (!isAuthenticated) return
    try {
      const response = await postAPI.checkLikeStatus(post.id)
      setLiked(response.data.liked)
    } catch (error) {
      // 静默失败，不影响显示
      console.error('Failed to check like status:', error)
    }
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('请先登录')
      return
    }
    if (liking) return

    setLiking(true)
    try {
      const response = await postAPI.toggleLike(post.id)
      setLiked(response.data.liked)
      setLikeCount(response.data.likeCount)
      
      // 更新每日任务：点赞（只在点赞时触发，取消点赞不触发）
      if (response.data.liked) {
        updateTask('like')
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
      if (error.response?.status === 401) {
        alert('请先登录')
      }
    } finally {
      setLiking(false)
    }
  }

  return (
    <article className="post-card">
      <div className="post-content">
        <div className="post-header">
          {post.category && (
            <>
              <span className="post-category">
                {getCategoryName(post.category.name)}
              </span>
              <span className="post-separator">•</span>
            </>
          )}
          <div className="post-author-wrapper">
            <Link to={`/user/${post.author?.id}`} className="post-author">
              {post.author?.username || '匿名用户'}
            </Link>
            {post.author?.tag && (
              <span 
                className={`post-author-tag ${isOfficialTag(post.author.tag) ? 'official-tag' : ''}`}
              >
                {isOfficialTag(post.author.tag) ? getOfficialTagText(t) : post.author.tag}
              </span>
            )}
            {post.author?.id && (
              <LevelBadge 
                exp={post.author?.exp ?? 0} 
                size="small" 
              />
            )}
          </div>
          <span className="post-separator">•</span>
          <span className="post-time">{formatDate(post.createdAt)}</span>
        </div>

        <Link to={`/post/${post.id}`} className="post-title">
          <h2>{post.title}</h2>
        </Link>

        {post.content && (
          <div className="post-content-preview">
            {post.content.split('\n').slice(0, 3).map((line, index) => {
              // 检查是否是Markdown图片格式 ![alt](url)
              const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
              if (imageMatch) {
                const [, alt, url] = imageMatch
                // 处理图片URL
                let imageUrl = url
                if (url.startsWith('/uploads/')) {
                  // 开发环境：使用相对路径，通过 Vite 代理
                  if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
                    imageUrl = url
                  } else {
                    // 生产环境：使用 URL 解析保证得到正确的 origin，避免出现 https://uploads/...
                    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
                    let origin
                    try {
                      origin = new URL(apiBase, window.location.origin).origin
                    } catch {
                      origin = window.location.origin
                    }
                    imageUrl = `${origin}${url}`
                  }
                }
                return (
                  <div key={index} className="post-image-preview">
                    <img 
                      src={imageUrl} 
                      alt={alt || '帖子图片'} 
                      className="post-preview-image"
                      loading="lazy"
                      onError={(e) => {
                        console.error('图片加载失败:', imageUrl)
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )
              }
              // 普通文本行（只显示前3行）
              if (line.trim() && index < 3) {
                return <p key={index} className="post-excerpt">{line}</p>
              }
              return null
            })}
          </div>
        )}
        
        {!post.content && post.excerpt && (
          <p className="post-excerpt">{post.excerpt}</p>
        )}

        <div className="post-footer">
          <div className="post-actions">
            <button
              className={`post-action like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={liking || !isAuthenticated}
              title={isAuthenticated ? (liked ? '取消点赞' : '点赞') : '请先登录'}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likeCount}</span>
            </button>
            <Link to={`/post/${post.id}`} className="post-action">
              <FaComment />
              <span>{post.commentCount || 0} {t('post.commentCountSuffix')}</span>
            </Link>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags-row">
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span
                  key={tag.id || tag.name}
                  className="post-tag"
                  style={{ cursor: 'default', pointerEvents: 'none' }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {post.createdAt && (
          <div className="post-publish-date-container">
            <span className="post-view-count">{post.viewCount || 0} {t('post.viewSuffix')}</span>
            <span className="post-publish-date">{formatPublishDate(post.createdAt)}</span>
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard

