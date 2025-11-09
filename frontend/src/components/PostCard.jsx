import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import { FaComment } from 'react-icons/fa'
import './PostCard.css'

const PostCard = ({ post }) => {
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

        {post.excerpt && (
          <p className="post-excerpt">{post.excerpt}</p>
        )}

        <div className="post-footer">
          <Link to={`/post/${post.id}`} className="post-action">
            <FaComment />
            <span>{post.commentCount || 0} 条评论</span>
          </Link>
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
  )
}

export default PostCard

