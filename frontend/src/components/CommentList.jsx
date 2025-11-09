import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { useAuth } from '../context/AuthContext'
import { commentAPI } from '../services/api'
import { FaReply } from 'react-icons/fa'
import './CommentList.css'

const CommentList = ({ comments, onUpdate, depth = 0 }) => {
  const { isAuthenticated } = useAuth()
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const handleReply = async (commentId, e) => {
    e.preventDefault()
    if (!replyText.trim() || !isAuthenticated) return

    setSubmitting(true)
    try {
      await commentAPI.replyComment(commentId, { content: replyText })
      setReplyText('')
      setReplyingTo(null)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!comments || comments.length === 0) {
    return <div className="comments-empty">暂无评论</div>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className={`comment ${depth > 0 ? 'comment-reply' : ''}`}>
          <div className="comment-content">
            <div className="comment-header">
              <Link to={`/user/${comment.author?.id}`} className="comment-author">
                {comment.author?.username || '匿名用户'}
              </Link>
              <span className="comment-separator">•</span>
              <span className="comment-time">{formatDate(comment.createdAt)}</span>
            </div>

            <div className="comment-body">
              <p>{comment.content}</p>
            </div>

            <div className="comment-actions">
              {isAuthenticated && (
                <button
                  className="comment-action-button"
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                >
                  <FaReply /> 回复
                </button>
              )}
              {comment.likeCount > 0 && (
                <span className="comment-like-count">{comment.likeCount} 点赞</span>
              )}
            </div>

            {replyingTo === comment.id && (
              <form
                onSubmit={(e) => handleReply(comment.id, e)}
                className="comment-reply-form"
              >
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="写下你的回复..."
                  rows={3}
                  className="comment-reply-textarea"
                />
                <div className="comment-reply-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                    className="comment-reply-cancel"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || submitting}
                    className="comment-reply-submit"
                  >
                    {submitting ? '发布中...' : '发布回复'}
                  </button>
                </div>
              </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <CommentList
                comments={comment.replies}
                onUpdate={onUpdate}
                depth={depth + 1}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList

