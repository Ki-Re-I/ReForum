import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { userAPI } from '../services/api'
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa'
import './Modal.css'
import './EditProfileModal.css'

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const { updateUser } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [tag, setTag] = useState(user?.tag || '')
  const [avatar, setAvatar] = useState(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [usernameUpdateInfo, setUsernameUpdateInfo] = useState(null)
  const [tagUpdateInfo, setTagUpdateInfo] = useState(null)
  const fileInputRef = useRef(null)

  // 检查是否可以修改用户名和称号
  useEffect(() => {
    if (user) {
      // 检查用户名修改限制
      if (user.usernameUpdatedAt) {
        try {
          const lastUpdate = new Date(user.usernameUpdatedAt)
          const now = new Date()
          const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
          const daysRemaining = 30 - daysSinceUpdate
          setUsernameUpdateInfo({
            canModify: daysRemaining <= 0,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          })
        } catch (error) {
          console.error('Error calculating username update info:', error)
          setUsernameUpdateInfo({ canModify: true, daysRemaining: null })
        }
      } else {
        setUsernameUpdateInfo({ canModify: true, daysRemaining: null })
      }

      // 检查称号修改限制
      if (user.tagUpdatedAt) {
        try {
          const lastUpdate = new Date(user.tagUpdatedAt)
          const now = new Date()
          const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
          const daysRemaining = 30 - daysSinceUpdate
          setTagUpdateInfo({
            canModify: daysRemaining <= 0,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          })
        } catch (error) {
          console.error('Error calculating tag update info:', error)
          setTagUpdateInfo({ canModify: true, daysRemaining: null })
        }
      } else {
        setTagUpdateInfo({ canModify: true, daysRemaining: null })
      }
    } else {
      // 如果 user 为 null，重置状态
      setUsernameUpdateInfo(null)
      setTagUpdateInfo(null)
    }
  }, [user])

  useEffect(() => {
    // 打开弹窗时锁定背景滚动
    const previousOverflow = document.body.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const scrollY = window.scrollY
    
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError(t('profile.edit.avatarInvalidType'))
      return
    }

    // 检查文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      setError(t('profile.edit.avatarTooLarge'))
      return
    }

    setAvatarFile(file)
    setError('')
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatar(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let avatarUrl = avatar

      // 如果有新头像，先上传
      if (avatarFile) {
        setUploading(true)
        try {
          const formData = new FormData()
          formData.append('image', avatarFile)

          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/upload/image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || t('profile.edit.uploadFailed'))
          }

          const data = await response.json()
          avatarUrl = data.url
          
          // 处理URL
          if (avatarUrl.startsWith('/uploads/')) {
            if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
              avatarUrl = data.url
            } else {
              const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
              let origin
              try {
                origin = new URL(apiBase, window.location.origin).origin
              } catch {
                origin = window.location.origin
              }
              avatarUrl = `${origin}${data.url}`
            }
          }
        } catch (error) {
          console.error('Avatar upload failed:', error)
          setError(error.message || t('profile.edit.uploadFailed'))
          setUploading(false)
          setSaving(false)
          return
        } finally {
          setUploading(false)
        }
      }

      // 更新用户资料
      const updateData = {
        bio: bio.trim(),
        avatar: avatarUrl,
      }

      // 只有可以修改时才添加username和tag
      if (usernameUpdateInfo?.canModify && username.trim() !== user?.username) {
        updateData.username = username.trim()
      }
      if (tagUpdateInfo?.canModify && tag.trim() !== user?.tag) {
        updateData.tag = tag.trim()
      }

      // 检查是否是测试用户
      const token = localStorage.getItem('token')
      if (token?.startsWith('test-token-')) {
        // 测试用户：直接更新本地存储
        const testUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = {
          ...testUser,
          ...updateData,
        }
        // 如果修改了username或tag，更新对应的更新时间
        if (updateData.username !== undefined && updateData.username !== testUser.username) {
          updatedUser.usernameUpdatedAt = new Date().toISOString()
        }
        if (updateData.tag !== undefined && updateData.tag !== testUser.tag) {
          updatedUser.tagUpdatedAt = new Date().toISOString()
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        updateUser(updatedUser)
        onUpdate?.(updatedUser)
        onClose()
        return
      }

      // 正常用户：调用API
      const response = await userAPI.updateProfile(updateData)
      const updatedUser = response.data
      
      updateUser(updatedUser)
      onUpdate?.(updatedUser)
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setError(error.response?.data?.message || t('profile.edit.updateFailed'))
    } finally {
      setSaving(false)
    }
  }

  const modalContent = (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">{t('profile.edit.title')}</h2>
        
        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 头像上传 */}
          <div className="form-group">
            <label htmlFor="avatar">{t('profile.edit.avatar')}</label>
            <div className="avatar-upload-section">
              <div className="avatar-preview-container">
                {avatarPreview ? (
                  <div className="avatar-preview-wrapper">
                    <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                    <button
                      type="button"
                      className="avatar-remove-button"
                      onClick={handleRemoveAvatar}
                      title={t('profile.edit.removeAvatar')}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="avatar-placeholder-large">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="avatar-upload-controls">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="avatar-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="spinning" />
                      {t('profile.edit.uploading')}
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      {avatarPreview ? t('profile.edit.changeAvatar') : t('profile.edit.uploadAvatar')}
                    </>
                  )}
                </button>
                <p className="avatar-upload-hint">{t('profile.edit.avatarHint')}</p>
              </div>
            </div>
          </div>

          {/* 用户名编辑 */}
          <div className="form-group">
            <label htmlFor="username">{t('profile.edit.username')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('profile.edit.usernamePlaceholder')}
              maxLength={20}
              disabled={!usernameUpdateInfo?.canModify}
              className={`username-input ${!usernameUpdateInfo?.canModify ? 'disabled' : ''}`}
            />
            {usernameUpdateInfo && !usernameUpdateInfo.canModify && usernameUpdateInfo.daysRemaining !== null && (
              <div className="update-limit-hint">
                {t('profile.edit.usernameLimit').replace('{days}', usernameUpdateInfo.daysRemaining)}
              </div>
            )}
          </div>

          {/* 称号编辑 */}
          <div className="form-group">
            <label htmlFor="tag">{t('profile.edit.tag')}</label>
            <input
              type="text"
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder={t('profile.edit.tagPlaceholder')}
              maxLength={20}
              disabled={!tagUpdateInfo?.canModify}
              className={`tag-input ${!tagUpdateInfo?.canModify ? 'disabled' : ''}`}
            />
            <div className="tag-character-count">
              {tag.length}/20
            </div>
            {tagUpdateInfo && !tagUpdateInfo.canModify && tagUpdateInfo.daysRemaining !== null && (
              <div className="update-limit-hint">
                {t('profile.edit.tagLimit').replace('{days}', tagUpdateInfo.daysRemaining)}
              </div>
            )}
          </div>

          {/* 简介编辑 */}
          <div className="form-group">
            <label htmlFor="bio">{t('profile.edit.bio')}</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profile.edit.bioPlaceholder')}
              rows={4}
              maxLength={200}
              className="bio-textarea"
            />
            <div className="bio-character-count">
              {bio.length}/200
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
              disabled={saving || uploading}
            >
              {t('profile.edit.cancel')}
            </button>
            <button
              type="submit"
              className="modal-submit-button"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <FaSpinner className="spinning" />
                  {t('profile.edit.saving')}
                </>
              ) : (
                t('profile.edit.save')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

export default EditProfileModal

