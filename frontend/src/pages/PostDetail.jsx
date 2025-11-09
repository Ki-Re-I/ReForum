import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { useAuth } from '../context/AuthContext'
import { postAPI, commentAPI } from '../services/api'
import { FaComment } from 'react-icons/fa'
import CommentList from '../components/CommentList'
import './PostDetail.css'

const PostDetail = () => {
  const { postId } = useParams()
  const { isAuthenticated } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [postId])

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
      fetchComments()
      if (post) {
        setPost({ ...post, commentCount: (post.commentCount || 0) + 1 })
      }
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
              <p>{post.content}</p>
            </div>
          )}

          <div className="post-footer">
            <div className="post-action">
              <FaComment />
              <span>{post.commentCount || 0} 条评论</span>
            </div>
            <div className="post-stats">
              <span>{post.viewCount || 0} 次浏览</span>
              {post.likeCount > 0 && (
                <span style={{ marginLeft: '1rem' }}>{post.likeCount} 点赞</span>
              )}
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
        <h2 className="comments-title">评论 ({comments.length})</h2>
        <CommentList comments={comments} onUpdate={fetchComments} />
      </div>
    </div>
  )
}

export default PostDetail

