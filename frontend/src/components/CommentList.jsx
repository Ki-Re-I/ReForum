import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { useAuth } from '../context/AuthContext'
import { commentAPI } from '../services/api'
import { FaReply } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import './CommentList.css'

const CommentList = ({ comments, onUpdate, depth = 0, maxDepth = 1, postId }) => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // 限制嵌套深度 - 允许回复到第1层（depth 0），第2层（depth 1）不允许
  const canReply = depth < maxDepth

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN,
      })
    } catch {
      return t('comment.unknownTime')
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
    return <div className="comments-empty">{t('comment.empty')}</div>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className={`comment ${depth > 0 ? 'comment-reply' : ''}`}>
          <div className="comment-content">
            <div className="comment-header">
              {comment.author?.id ? (
                <Link to={`/user/${comment.author.id}`} className="comment-author">
                  {comment.author.username || t('comment.anonymous')}
                </Link>
              ) : (
                <span className="comment-author">{t('comment.anonymous')}</span>
              )}
              <span className="comment-separator">•</span>
              <span className="comment-time">{formatDate(comment.createdAt)}</span>
            </div>

            <div className="comment-body">
              <p>{comment.content}</p>
            </div>

            <div className="comment-actions">
              {isAuthenticated && canReply && (
                <button
                  className="comment-action-button"
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                >
                  <FaReply /> {t('comment.reply')}
                </button>
              )}
              {isAuthenticated && !canReply && (
                <span className="comment-depth-limit">{t('comment.depthLimit')}</span>
              )}
              {comment.likeCount > 0 && (
                <span className="comment-like-count">
                  {comment.likeCount} {t('comment.likesSuffix')}
                </span>
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
                  placeholder={t('comment.replyPlaceholder')}
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
                    {t('comment.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || submitting}
                    className="comment-reply-submit"
                  >
                    {submitting ? t('comment.submitting') : t('comment.submit')}
                  </button>
                </div>
              </form>
            )}

            {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
              <CommentList
                comments={comment.replies}
                onUpdate={onUpdate}
                depth={depth + 1}
                maxDepth={maxDepth}
                postId={postId}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList

