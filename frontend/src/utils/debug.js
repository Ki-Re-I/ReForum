// 调试工具
export const logApiStatus = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
  console.log('=== REForum 前端调试信息 ===')
  console.log('API Base URL:', API_BASE_URL)
  console.log('Environment:', import.meta.env.MODE)
  console.log('Timestamp:', new Date().toISOString())
}

export const checkApiConnection = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    console.log('✅ 后端 API 连接正常')
    return true
  } catch (error) {
    console.warn('⚠️ 后端 API 未运行或无法连接:', error.message)
    console.log('💡 提示：这是正常的，如果后端尚未开发')
    return false
  }
}


