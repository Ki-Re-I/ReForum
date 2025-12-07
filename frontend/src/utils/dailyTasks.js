// 每日任务系统

const STORAGE_KEY = 'daily_tasks'
const EXP_STORAGE_KEY = 'user_exp'

// 获取今天的日期字符串（YYYY-MM-DD）
const getTodayString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// 获取今天的任务状态
export const getTodayTasks = () => {
  const today = getTodayString()
  const stored = localStorage.getItem(STORAGE_KEY)
  
  if (!stored) {
    return {
      date: today,
      post: false,
      like: false,
      comment: false,
    }
  }
  
  const tasks = JSON.parse(stored)
  
  // 如果是新的一天，重置任务
  if (tasks.date !== today) {
    return {
      date: today,
      post: false,
      like: false,
      comment: false,
    }
  }
  
  return tasks
}

// 更新任务状态
export const updateTask = (taskType) => {
  const tasks = getTodayTasks()
  const today = getTodayString()
  
  // 如果任务已完成，不重复奖励
  if (tasks[taskType]) {
    return false
  }
  
  // 标记任务完成
  tasks[taskType] = true
  tasks.date = today
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  
  // 添加经验值
  addExp(5)
  
  return true
}

// 获取用户经验值
export const getUserExp = (user = null) => {
  // 如果传入了用户对象，优先使用用户对象中的 exp
  if (user && (user.exp !== undefined && user.exp !== null)) {
    // 如果是测试用户，并且用户对象中有exp，则使用用户对象中的exp
    const userId = String(user.id || '')
    if (userId.startsWith('test-user-') || userId === 'test-user-001') {
      return user.exp
    }
    // 如果是正常用户，也使用用户对象中的exp（从服务器获取的）
    return user.exp
  }
  
  // 如果没有传入用户对象或用户对象中没有exp，从localStorage读取
  const stored = localStorage.getItem(EXP_STORAGE_KEY)
  // 如果是测试用户，返回70级经验值
  const token = localStorage.getItem('token')
  const tokenStr = String(token || '')
  if (tokenStr.startsWith('test-token-')) {
    const testUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (testUser.exp !== undefined && testUser.exp !== null) {
      return testUser.exp
    }
    // 如果没有exp字段，设置70级经验值
    const exp70 = 15000
    setUserExp(exp70)
    return exp70
  }
  return stored ? parseInt(stored, 10) : 0
}

// 添加经验值
export const addExp = (amount) => {
  const currentExp = getUserExp()
  const newExp = currentExp + amount
  localStorage.setItem(EXP_STORAGE_KEY, String(newExp))
  return newExp
}

// 设置经验值（用于同步服务器数据）
export const setUserExp = (exp) => {
  localStorage.setItem(EXP_STORAGE_KEY, String(exp))
}

// 检查任务是否完成
export const isTaskCompleted = (taskType) => {
  const tasks = getTodayTasks()
  return tasks[taskType] || false
}

// 获取今日完成的任务数量
export const getCompletedTasksCount = () => {
  const tasks = getTodayTasks()
  let count = 0
  if (tasks.post) count++
  if (tasks.like) count++
  if (tasks.comment) count++
  return count
}

