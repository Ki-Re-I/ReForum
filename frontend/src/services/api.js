import axios from 'axios'
import { mockPostAPI } from '../data/mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 增加到10秒超时，给后端更多处理时间
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 如果是网络错误（后端未运行），不跳转，只记录错误
    if (!error.response) {
      // 网络错误，可能是后端未运行
      console.warn('API request failed (backend may be unavailable):', error.message)
      return Promise.reject(error)
    }
    
    // 处理速率限制错误（429）
    if (error.response?.status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 60
      const message = error.response?.data?.message || `请求过于频繁，请 ${retryAfter} 秒后再试`
      console.warn('Rate limit exceeded:', message)
      
      // 可以在这里显示全局提示
      if (typeof window !== 'undefined' && window.alert) {
        // 只在开发环境或特定情况下显示alert
        // 生产环境可以使用toast通知
        console.error(message)
      }
      
      return Promise.reject(new Error(message))
    }
    
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储
      // 但不要强制跳转，让组件决定如何处理
      console.warn('Unauthorized access, clearing token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 只在当前不在登录相关页面时才跳转
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        // 使用更温和的方式，不强制跳转
      }
    }
    return Promise.reject(error)
  }
)

// 认证 API
export const authAPI = {
  sendVerificationCode: (email) => api.post('/auth/send-verification-code', { email }),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
}

// 检查是否是测试用户ID
const isTestUserId = (userId) => {
  const userIdStr = String(userId || '')
  return userIdStr.startsWith('test-user-') || userIdStr === 'test-user-001'
}

// 生成测试用户数据
const getTestUserData = (userId) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const testUser = {
    id: userId || storedUser.id || 'test-user-001',
    username: storedUser.username || 'testuser',
    email: storedUser.email || 'test@example.com',
    avatar: storedUser.avatar || null,
    bio: storedUser.bio || '这是一个测试用户，用于开发和测试目的。',
    tag: storedUser.tag || '测试用户',
    postCount: 3,
    commentCount: 12,
    receivedLikes: 25,
    exp: storedUser.exp || 15000, // 70级经验值
    joinDate: storedUser.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天前
    createdAt: storedUser.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    usernameUpdatedAt: storedUser.usernameUpdatedAt || null,
    tagUpdatedAt: storedUser.tagUpdatedAt || null,
  }
  return Promise.resolve({ data: testUser })
}

// 用户 API
export const userAPI = {
  getProfile: () => {
    const token = localStorage.getItem('token')
    const tokenStr = String(token || '')
    if (tokenStr.startsWith('test-token-')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return getTestUserData(user.id)
    }
    return api.get('/users/profile')
  },
  updateProfile: (data) => api.put('/users/profile', data),
  getUser: (userId) => {
    if (isTestUserId(userId)) {
      return getTestUserData(userId)
    }
    return api.get(`/users/${userId}`)
  },
}

// 帖子 API
export const postAPI = {
  getPosts: (params) => {
    if (USE_MOCK_DATA) {
      return mockPostAPI.getPosts(params)
    }
    return api.get('/posts', { params })
  },
  getPost: (postId) => {
    if (USE_MOCK_DATA) {
      return mockPostAPI.getPost(postId)
    }
    return api.get(`/posts/${postId}`)
  },
  createPost: (data) => {
    if (USE_MOCK_DATA) {
      // Mock 模式下返回一个模拟的创建结果
      return Promise.resolve({
        data: {
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
        },
      })
    }
    return api.post('/posts', data)
  },
  updatePost: (postId, data) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { id: postId, ...data } })
    }
    return api.put(`/posts/${postId}`, data)
  },
  deletePost: (postId) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { id: postId } })
    }
    return api.delete(`/posts/${postId}`)
  },
  toggleLike: (postId) => {
    if (USE_MOCK_DATA) {
      return mockPostAPI.toggleLike(postId)
    }
    return api.post(`/posts/${postId}/like`)
  },
  checkLikeStatus: (postId) => {
    if (USE_MOCK_DATA) {
      return mockPostAPI.checkLikeStatus(postId)
    }
    return api.get(`/posts/${postId}/like`)
  },
}

// 评论 API
export const commentAPI = {
  getComments: (postId, params) => api.get(`/posts/${postId}/comments`, { params }),
  createComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  replyComment: (commentId, data) => api.post(`/comments/${commentId}/reply`, data),
}

// 版块和标签 API
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getTags: (params) => api.get('/tags', { params }),
}

// 通知 API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
}

export default api

