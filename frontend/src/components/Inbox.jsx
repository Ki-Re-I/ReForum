import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { FaBell, FaTimes } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { notificationAPI } from '../services/api'
import './Inbox.css'

const formatLocale = {
  zh: zhCN,
  en: enUS,
  ja,
}

const Inbox = ({ showLabel = false }) => {
  const { isAuthenticated } = useAuth()
  const { t, language } = useLanguage()
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const intervalRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  // 获取未读数量
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return
    try {
      const response = await notificationAPI.getUnreadCount()
      setUnreadCount(response.data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  // 获取通知列表
  const fetchNotifications = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const response = await notificationAPI.getNotifications({ limit: 20 })
      setNotifications(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // 标记为已读
  const handleMarkAsRead = async (notificationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // 标记全部为已读
  const handleMarkAllAsRead = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  // 删除通知
  const handleDelete = async (notificationId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await notificationAPI.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      // 如果删除的是未读通知，减少计数
      const deleted = notifications.find(n => n.id === notificationId)
      if (deleted && !deleted.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // 监听窗口大小
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 点击外部关闭下拉菜单（桌面端）
  useEffect(() => {
    if (!showDropdown || isMobile) return
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown, isAuthenticated, isMobile])

  // 打开下拉时获取通知列表（桌面端和移动端都适用）
  useEffect(() => {
    if (!showDropdown || !isAuthenticated) return
    fetchNotifications()
  }, [showDropdown, isAuthenticated])

  // 移动端锁定背景滚动
  useEffect(() => {
    if (!showDropdown || !isMobile) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showDropdown, isMobile])

  // 定期更新未读数量
  useEffect(() => {
    if (!isAuthenticated) return

    fetchUnreadCount()
    // 每30秒更新一次未读数量
    intervalRef.current = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: formatLocale[language] || zhCN,
      })
    } catch {
      return dateString
    }
  }

  // 格式化通知标题（根据通知类型和语言）
  const formatNotificationTitle = (notification) => {
    // 如果通知类型是 new_post，根据语言生成标题
    if (notification.type === 'new_post' && notification.related_username) {
      const username = notification.related_username
      const translationKey = 'notification.newPost'
      const template = t(translationKey)
      return template.replace('{username}', username)
    }
    
    // 如果标题包含"发布了新帖子"（中文），尝试替换为多语言版本
    if (notification.title && notification.title.includes('发布了新帖子')) {
      const username = notification.related_username || notification.title.split(' ')[0]
      const translationKey = 'notification.newPost'
      const template = t(translationKey)
      return template.replace('{username}', username)
    }
    
    // 其他情况直接返回原始标题
    return notification.title
  }

  const dropdownPanel = (
    <div className="inbox-dropdown" ref={!isMobile ? dropdownRef : null}>
          <div className="inbox-header">
            <h3>{t('header.inbox') || '通知'}</h3>
        <div className="inbox-header-actions">
            {unreadCount > 0 && (
              <button
                className="inbox-mark-all-read"
                onClick={handleMarkAllAsRead}
              >
                {t('header.markAllRead') || '全部已读'}
              </button>
            )}
          {isMobile && (
            <button className="inbox-close" onClick={() => setShowDropdown(false)} aria-label="关闭">
              <FaTimes />
            </button>
          )}
        </div>
          </div>

          <div className="inbox-list">
            {loading ? (
              <div className="inbox-skeleton">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inbox-item-skeleton">
                    <div className="skeleton-line skeleton-line-md" style={{ width: '80%', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton-line skeleton-line-sm" style={{ width: '60%', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton-line skeleton-line-sm" style={{ width: '40%' }}></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="inbox-empty">
                {t('header.noNotifications') || '暂无通知'}
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.related_post_id ? `/post/${notification.related_post_id}` : '#'}
                  className={`inbox-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id, { preventDefault: () => {}, stopPropagation: () => {} })
                    }
                    setShowDropdown(false)
                  }}
                >
                  <div className="inbox-item-content">
                    <div className="inbox-item-title">{formatNotificationTitle(notification)}</div>
                    {notification.content && (
                      <div className="inbox-item-text">{notification.content}</div>
                    )}
                    <div className="inbox-item-time">
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                  <div className="inbox-item-actions">
                    {!notification.is_read && (
                      <button
                        className="inbox-item-mark-read"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        title={t('header.markAsRead') || '标记为已读'}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
  )

  return (
    <div className={`inbox-container ${showLabel ? 'with-label' : ''}`}>
      <button
        className={`inbox-button ${showLabel ? 'with-label' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        title={t('header.inbox') || '通知'}
        aria-label={t('header.inbox') || '通知'}
      >
        {showLabel && <span className="inbox-button-label">{t('header.inbox')}</span>}
        <FaBell />
        {unreadCount > 0 && (
          <span className={`inbox-badge ${showLabel ? 'inline' : ''}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown &&
        (isMobile
          ? createPortal(
              <div className="inbox-overlay" onClick={() => setShowDropdown(false)}>
                <div className="inbox-modal" onClick={(e) => e.stopPropagation()}>
                  {dropdownPanel}
                </div>
              </div>,
              document.body
            )
          : dropdownPanel)}
    </div>
  )
}

export default Inbox

