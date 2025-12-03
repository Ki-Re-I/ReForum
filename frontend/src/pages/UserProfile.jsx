import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { userAPI, postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import { FaTrash } from 'react-icons/fa'
import './UserProfile.css'

const UserProfile = () => {
  const { userId } = useParams()
  const { user: currentUser, isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const [userRes, postsRes] = await Promise.all([
        userAPI.getUser(userId),
        postAPI.getPosts({ author: userId, limit: 50 })
      ])
      setUser(userRes.data)
      setPosts(postsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm(t('profile.deleteConfirm'))) {
      return
    }

    setDeleting(postId)
    try {
      await postAPI.deletePost(postId)
      // 删除成功后，从列表中移除该帖子
      setPosts(posts.filter(post => post.id !== postId))
      // 更新用户的帖子数量
      if (user) {
        setUser({ ...user, postCount: (user.postCount || 1) - 1 })
      }
      // 触发自定义事件，通知其他组件刷新（如RightSidebar的标签列表）
      window.dispatchEvent(new CustomEvent('postDeleted'))
    } catch (error) {
      console.error('Failed to delete post:', error)
      const errorMsg = error.response?.data?.message || t('profile.deleteFailed')
      alert(errorMsg)
    } finally {
      setDeleting(null)
    }
  }

  // 检查是否是当前登录用户自己的资料页
  const isOwnProfile = isAuthenticated && currentUser && parseInt(userId) === currentUser.id

  if (loading) {
    return <div className="user-profile-loading">{t('profile.loading')}</div>
  }

  if (!user) {
    return <div className="user-profile-error">{t('profile.userNotFound')}</div>
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
          <h1 className="profile-username">{user.username}</h1>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.postCount || 0}</span>
              <span className="stat-label">{t('profile.posts')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.commentCount || 0}</span>
              <span className="stat-label">{t('profile.comments')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {new Date(user.joinDate).toLocaleDateString(
                  language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }
                )}
              </span>
              <span className="stat-label">{t('profile.joinTime')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 className="profile-section-title">{t('profile.postsTitle')}</h2>
        {posts.length === 0 ? (
          <div className="profile-empty">{t('profile.empty')}</div>
        ) : (
          <div className="profile-posts">
            {posts.map((post) => (
              <div key={post.id} className="profile-post-item">
                <PostCard post={post} />
                {isOwnProfile && (
                  <button
                    className="delete-post-button"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deleting === post.id}
                    title={t('profile.delete')}
                  >
                    {deleting === post.id ? t('profile.deleting') : <FaTrash />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile

