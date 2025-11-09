import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userAPI, postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import './UserProfile.css'

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const userRes = await userAPI.getUser(userId)
      setUser(userRes.data)
      // 注意：当前 API 可能不支持按作者筛选
      // 实际项目中应该在后端实现按作者筛选帖子的功能
      // 这里暂时设置为空数组，等待后端实现
      setPosts([])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="user-profile-loading">加载中...</div>
  }

  if (!user) {
    return <div className="user-profile-error">用户不存在</div>
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">u/{user.username}</h1>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.postCount || 0}</span>
              <span className="stat-label">帖子</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.commentCount || 0}</span>
              <span className="stat-label">评论</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {new Date(user.joinDate).getFullYear()}
              </span>
              <span className="stat-label">加入年份</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 className="profile-section-title">发布的帖子</h2>
        {posts.length === 0 ? (
          <div className="profile-empty">该用户还没有发布任何帖子</div>
        ) : (
          <div className="profile-posts">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile

