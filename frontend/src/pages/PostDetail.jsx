import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { useAuth } from '../context/AuthContext'
import { postAPI, commentAPI } from '../services/api'
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentList from '../components/CommentList'
import './PostDetail.css'

const PostDetail = () => {
  const { postId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [postId])

  useEffect(() => {
    // 如果后端返回了liked状态，直接使用
    if (post?.liked !== undefined) {
      setLiked(post.liked)
    } else if (isAuthenticated && postId) {
      checkLikeStatus()
    }
  }, [post?.liked, isAuthenticated, postId])

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(postId)
      setPost(response.data)
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkLikeStatus = async () => {
    if (!isAuthenticated) return
    try {
      const response = await postAPI.checkLikeStatus(postId)
      setLiked(response.data.liked)
    } catch (error) {
      console.error('Failed to check like status:', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('请先登录')
      return
    }
    if (liking) return

    setLiking(true)
    try {
      const response = await postAPI.toggleLike(postId)
      setLiked(response.data.liked)
      setPost(prev => ({
        ...prev,
        likeCount: response.data.likeCount
      }))
    } catch (error) {
      console.error('Failed to toggle like:', error)
      if (error.response?.status === 401) {
        alert('请先登录')
      } else {
        alert('操作失败，请重试')
      }
    } finally {
      setLiking(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(postId)
      setComments(response.data || [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !isAuthenticated) return

    setSubmitting(true)
    try {
      await commentAPI.createComment(postId, { content: commentText })
      setCommentText('')
      // 重新获取评论和帖子数据
      await Promise.all([fetchComments(), fetchPost()])
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

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

  if (loading) {
    return <div className="post-detail-loading">加载中...</div>
  }

  if (!post) {
    return <div className="post-detail-error">帖子不存在</div>
  }

  return (
    <div className="post-detail">
      <article className="post-detail-card">
        <div className="post-content">
          <div className="post-header">
            {post.category && (
              <>
                <span className="post-category">{post.category.name}</span>
                <span className="post-separator">•</span>
              </>
            )}
            <Link to={`/user/${post.author?.id}`} className="post-author">
              {post.author?.username || '匿名用户'}
            </Link>
            <span className="post-separator">•</span>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>

          <h1 className="post-title">{post.title}</h1>

          {post.content && (
            <div className="post-body">
              {post.content.split('\n').map((line, index) => {
                // 检查是否是Markdown图片格式 ![alt](url)
                const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
                if (imageMatch) {
                  const [, alt, url] = imageMatch
                  // 处理图片URL
                  let imageUrl = url
                  // 如果是相对路径 /uploads/xxx，需要转换为完整URL
                  if (url.startsWith('/uploads/')) {
                    // 开发环境：使用相对路径，通过 Vite 代理
                    if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
                      imageUrl = url  // 直接使用相对路径，Vite 会代理
                    } else {
                      // 生产环境：从环境变量获取基础URL
                      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
                      let baseUrl = apiBase
                      // 如果包含 /api，去掉 /api 及其后面的路径
                      if (baseUrl.includes('/api')) {
                        baseUrl = baseUrl.split('/api')[0]
                      }
                      // 如果 baseUrl 为空，使用当前域名
                      if (!baseUrl || baseUrl === '') {
                        baseUrl = window.location.origin
                      }
                      imageUrl = `${baseUrl}${url}`
                    }
                  } else if (!url.startsWith('http')) {
                    // 如果不是http开头也不是/uploads开头，可能是其他相对路径
                    if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
                      imageUrl = url.startsWith('/') ? url : `/${url}`
                    } else {
                      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
                      let baseUrl = apiBase
                      if (baseUrl.includes('/api')) {
                        baseUrl = baseUrl.split('/api')[0]
                      }
                      if (!baseUrl || baseUrl === '') {
                        baseUrl = window.location.origin
                      }
                      imageUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
                    }
                  }
                  return (
                    <div key={index} className="post-image-container">
                      <img 
                        src={imageUrl} 
                        alt={alt || '帖子图片'} 
                        className="post-image"
                        loading="lazy"
                      />
                    </div>
                  )
                }
                // 普通文本行
                if (line.trim()) {
                  return <p key={index}>{line}</p>
                }
                return <br key={index} />
              })}
            </div>
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
                <span>{post.likeCount || 0}</span>
              </button>
              <div className="post-action">
                <FaComment />
                <span>{post.commentCount || 0} 条评论</span>
              </div>
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

      {isAuthenticated ? (
        <div className="comment-form-container">
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论..."
              rows={4}
              className="comment-textarea"
            />
            <div className="comment-form-actions">
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="comment-submit-button"
              >
                {submitting ? '发布中...' : '发布评论'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="comment-login-prompt">
          <p>请<a href="/login">登录</a>后发表评论</p>
        </div>
      )}

      <div className="comments-section">
        <h2 className="comments-title">评论 ({post.commentCount || 0})</h2>
        <CommentList comments={comments} onUpdate={fetchComments} postId={postId} />
      </div>
    </div>
  )
}

export default PostDetail

