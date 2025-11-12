import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { useAuth } from '../context/AuthContext'
import { postAPI } from '../services/api'
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import './PostCard.css'

const PostCard = ({ post }) => {
  const { isAuthenticated } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [liking, setLiking] = useState(false)

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
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN,
      })
    } catch {
      return '未知时间'
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
                {post.category.name}
              </span>
              <span className="post-separator">•</span>
            </>
          )}
          <Link to={`/user/${post.author?.id}`} className="post-author">
            {post.author?.username || '匿名用户'}
          </Link>
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
                    // 生产环境：从环境变量获取基础URL
                    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
                    let baseUrl = apiBase
                    if (baseUrl.includes('/api')) {
                      baseUrl = baseUrl.split('/api')[0]
                    }
                    if (!baseUrl || baseUrl === '') {
                      baseUrl = window.location.origin
                    }
                    imageUrl = `${baseUrl}${url}`
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
              <span>{post.commentCount || 0} 条评论</span>
            </Link>
          </div>
          <div className="post-stats">
            <span>{post.viewCount || 0} 次浏览</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
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
        )}
      </div>
    </article>
  )
}

export default PostCard

