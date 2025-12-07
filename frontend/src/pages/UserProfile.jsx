import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { userAPI, postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import EditProfileModal from '../components/EditProfileModal'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { isOfficialTag, getOfficialTagText } from '../utils/tagUtils'
import { getUserExp } from '../utils/dailyTasks'
import { getLevelFromExp } from '../utils/levelSystem'
import LevelBadge from '../components/LevelBadge'
import ExpProgressBar from '../components/ExpProgressBar'
import StatsAccordion from '../components/StatsAccordion'
import DailyTasks from '../components/DailyTasks'
import './UserProfile.css'

const UserProfile = () => {
  const { userId } = useParams()
  const { user: currentUser, isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // 检查是否是测试用户
      const token = localStorage.getItem('token')
      const tokenStr = String(token || '')
      const isTestUser = tokenStr.startsWith('test-token-')
      
      if (isTestUser) {
        // 测试用户：使用模拟数据
        const testUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (testUser.id === userId || userId === 'test-user-001') {
          const mockUserData = {
            ...testUser,
            bio: '这是一个测试用户，用于开发和测试目的。This is a test user for development and testing purposes.',
            postCount: 3,
            commentCount: 12,
            receivedLikes: 25,
            exp: testUser.exp || 15000, // 70级经验值
            joinDate: testUser.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
          
          // 生成一些模拟帖子
          const mockPosts = [
            {
              id: 'test-post-1',
              title: '测试帖子 1 - 欢迎使用 REForum',
              content: '这是一个测试帖子，用于演示用户资料页面的功能。',
              author: {
                id: testUser.id,
                username: testUser.username,
                avatar: testUser.avatar,
                tag: testUser.tag || '',
              },
              category: { name: '技术讨论' },
              tags: [
                { id: 'tag-1', name: '测试' },
                { id: 'tag-2', name: '演示' }
              ],
              likeCount: 5,
              commentCount: 2,
              viewCount: 15,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              images: [],
            },
            {
              id: 'test-post-2',
              title: '测试帖子 2 - PWA 功能测试',
              content: '这个帖子用于测试 PWA 功能的离线缓存和安装提示。',
              author: {
                id: testUser.id,
                username: testUser.username,
                avatar: testUser.avatar,
                tag: testUser.tag || '',
              },
              category: { name: '项目展示' },
              tags: [
                { id: 'tag-3', name: 'PWA' },
                { id: 'tag-4', name: '测试' }
              ],
              likeCount: 8,
              commentCount: 3,
              viewCount: 22,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              images: [],
            },
            {
              id: 'test-post-3',
              title: '测试帖子 3 - 多语言支持',
              content: 'REForum 支持中文、英文和日文三种语言。',
              author: {
                id: testUser.id,
                username: testUser.username,
                avatar: testUser.avatar,
                tag: testUser.tag || '',
              },
              category: { name: '资源分享' },
              tags: [
                { id: 'tag-5', name: '多语言' },
                { id: 'tag-6', name: '国际化' }
              ],
              likeCount: 12,
              commentCount: 5,
              viewCount: 35,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              images: [],
            },
          ]
          
          setUser(mockUserData)
          setPosts(mockPosts)
          setLoading(false)
          return
        }
      }
      
      // 正常用户：从API获取数据
      const [userRes, postsRes] = await Promise.all([
        userAPI.getUser(userId),
        postAPI.getPosts({ author: userId, limit: 50 }).catch(() => {
          // API失败时返回空列表
          return { data: { data: [] } }
        })
      ])
      setUser(userRes.data)
      setPosts(postsRes.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // 如果是测试用户，即使API失败也显示用户信息
      const token = localStorage.getItem('token')
      if (token?.startsWith('test-token-')) {
        const testUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (testUser.id === userId || userId === 'test-user-001') {
          setUser({
            ...testUser,
            bio: '这是一个测试用户，用于开发和测试目的。',
            postCount: 0,
            commentCount: 0,
            joinDate: testUser.createdAt || new Date().toISOString(),
          })
          setPosts([])
        }
      }
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
  const isOwnProfile = isAuthenticated && currentUser && (
    parseInt(userId) === currentUser.id || 
    userId === currentUser.id || 
    (String(currentUser.id || '').startsWith('test-user-') && userId === currentUser.id)
  )

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser)
    // 如果当前用户就是更新的用户，也更新 currentUser
    if (isOwnProfile) {
      // AuthContext 会自动更新，这里只需要更新本地状态
    }
  }

  if (loading) {
    return (
      <div className="user-profile">
        <div className="profile-header profile-skeleton">
          <div className="profile-avatar-section">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-line skeleton-line-sm" style={{ width: '80px', height: '28px', borderRadius: '14px' }}></div>
          </div>
          <div className="profile-info-skeleton">
            <div className="skeleton-line skeleton-line-lg" style={{ width: '200px', marginBottom: '0.75rem' }}></div>
            <div className="skeleton-line skeleton-line-md" style={{ width: '100%', marginBottom: '1rem' }}></div>
            <div className="profile-stats-skeleton">
              <div className="stat-item-skeleton">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '40px', height: '1.5rem', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-sm" style={{ width: '50px', height: '0.85rem' }}></div>
              </div>
              <div className="stat-item-skeleton">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '40px', height: '1.5rem', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-sm" style={{ width: '50px', height: '0.85rem' }}></div>
              </div>
              <div className="stat-item-skeleton">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '40px', height: '1.5rem', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-sm" style={{ width: '50px', height: '0.85rem' }}></div>
              </div>
              <div className="stat-item-skeleton">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '100px', height: '1.5rem', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-sm" style={{ width: '70px', height: '0.85rem' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-content profile-content-skeleton">
          <div className="skeleton-line skeleton-line-lg" style={{ width: '150px', marginBottom: '1.5rem' }}></div>
          <div className="profile-posts-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="profile-post-skeleton">
                <div className="skeleton-line skeleton-line-md" style={{ width: '100%', marginBottom: '0.75rem' }}></div>
                <div className="skeleton-line skeleton-line-lg" style={{ width: '100%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-fade" style={{ width: '80%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton-line skeleton-line-fade" style={{ width: '60%', marginBottom: '1rem' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="skeleton-line skeleton-line-sm" style={{ width: '60px', height: '1.5rem' }}></div>
                    <div className="skeleton-line skeleton-line-sm" style={{ width: '60px', height: '1.5rem' }}></div>
                  </div>
                  <div className="skeleton-line skeleton-line-sm" style={{ width: '80px', height: '0.75rem' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="user-profile-error">{t('profile.userNotFound')}</div>
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
          </div>
          <div className="profile-level-row">
            {(() => {
              const userExp = getUserExp(user)
              return <LevelBadge exp={userExp} size="large" />
            })()}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-username-row">
            <div className="profile-username-wrapper">
          <h1 className="profile-username">{user.username}</h1>
              {user.tag && (
                <span 
                  className={`profile-tag ${isOfficialTag(user.tag) ? 'official-tag' : ''}`}
                >
                  {isOfficialTag(user.tag) ? getOfficialTagText(t) : user.tag}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <button
                className="edit-profile-button"
                onClick={() => setShowEditModal(true)}
                title={t('profile.edit.title')}
              >
                <FaEdit />
                <span>{t('profile.edit.button')}</span>
              </button>
            )}
          </div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
        <div className="profile-exp-section">
          <ExpProgressBar user={user} />
        </div>
      </div>

      <div className="profile-stats-section">
        <StatsAccordion 
          stats={{
            postCount: user.postCount || 0,
            commentCount: user.commentCount || 0,
            receivedLikes: user.receivedLikes || user.likeCount || 0,
            joinDate: user.joinDate
          }}
        />
      </div>

      {isOwnProfile && <DailyTasks />}

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

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}

export default UserProfile

