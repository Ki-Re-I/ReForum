import React, { createContext, useState, useEffect, useContext } from 'react'
import { authAPI, userAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // 初始化时检查用户登录状态
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      // 检查是否启用测试登录
      // 只有在开发/测试环境中，且 VITE_ENABLE_TEST_LOGIN 明确设置为 'true' 时才启用
      // 生产环境中无论设置什么值都禁用测试登录
      const isDevOrTest = import.meta.env.DEV || import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
      const enableTestLogin = isDevOrTest && import.meta.env.VITE_ENABLE_TEST_LOGIN === 'true'
      
      // 如果测试登录被禁用，且当前是测试用户，清除登录状态
      // 确保 storedToken 是字符串
      const tokenStr = String(storedToken || '')
      if (!enableTestLogin && storedToken && tokenStr.startsWith('test-token-')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        setLoading(false)
        return
      }
      
      // 如果有存储的用户信息，先使用它（即使后端未运行也能显示界面）
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          // 如果测试登录被禁用，且是测试用户，清除登录状态
          // 确保 id 和 token 都是字符串再调用 startsWith
          const userId = String(parsedUser.id || '')
          const tokenStr = String(storedToken || '')
          if (!enableTestLogin && (userId.startsWith('test-user-') || tokenStr.startsWith('test-token-'))) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setUser(null)
            setLoading(false)
            return
          }
          setUser(parsedUser)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          // 解析失败时清除损坏的数据
          localStorage.removeItem('user')
        }
      }
      
      // 如果有 token，尝试验证（但不阻塞界面加载）
      if (storedToken) {
        setToken(storedToken)
        // 立即停止加载，让界面先显示出来
        setLoading(false)
        
        // 异步验证 token（不阻塞界面）
        userAPI.getProfile()
          .then((response) => {
            setUser(response.data)
            localStorage.setItem('user', JSON.stringify(response.data))
          })
          .catch((error) => {
            // API 失败不影响界面显示
            console.warn('Failed to verify token (backend may be unavailable):', error.message)
            // 如果是网络错误或500错误（可能是数据库迁移未执行），不清除 token，允许用户继续使用
            if (error.response) {
              // 只有明确的 401 或 403 错误才清除 token
              // 500 错误可能是数据库迁移未执行，不应该清除登录状态
              if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setToken(null)
                setUser(null)
              }
            }
          })
      } else {
        // 没有 token，直接停止加载
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'error.loginFailed',
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token: newToken, user: newUser } = response.data
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'error.registerFailed',
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 测试登录功能（仅在开发/测试环境启用）
  const testLogin = (testUserData = null) => {
    // 检查是否启用测试登录
    // 只有在开发/测试环境中，且 VITE_ENABLE_TEST_LOGIN 明确设置为 'true' 时才启用
    // 生产环境中无论设置什么值都禁用测试登录
    const isDevOrTest = import.meta.env.DEV || import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    const enableTestLogin = isDevOrTest && import.meta.env.VITE_ENABLE_TEST_LOGIN === 'true'
    
    if (!enableTestLogin) {
      console.warn('Test login is disabled. Set VITE_ENABLE_TEST_LOGIN=true in development/test environment to enable.')
      return { success: false, error: 'Test login is disabled' }
    }

    // 默认测试用户数据
          const defaultTestUser = {
            id: 'test-user-001',
            username: 'testuser',
            email: 'test@example.com',
            avatar: null,
            tag: '测试用户',
            exp: 15000, // 70级经验值
            createdAt: new Date().toISOString(),
          }

    const userToLogin = testUserData || defaultTestUser
    const testToken = `test-token-${Date.now()}`

    // 设置用户和 token
    setToken(testToken)
    setUser(userToLogin)
    localStorage.setItem('token', testToken)
    localStorage.setItem('user', JSON.stringify(userToLogin))

    console.log('Test login successful:', userToLogin)
    return { success: true, user: userToLogin }
  }

  // 检查是否是测试用户
  const isTestUser = () => {
    if (!token || !user) return false
    const tokenStr = String(token || '')
    const userId = String(user.id || '')
    return tokenStr.startsWith('test-token-') || userId.startsWith('test-user-')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    testLogin,
    isTestUser,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

