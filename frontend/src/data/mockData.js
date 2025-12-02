// 假数据用于本地开发和预览效果
// 可以通过环境变量 VITE_USE_MOCK_DATA=true 来启用

// 假分类数据
export const mockCategories = [
  {
    id: 1,
    name: '技术讨论',
    description: '技术相关讨论',
    color: '#3b82f6',
    postCount: 15,
  },
  {
    id: 2,
    name: '问答求助',
    description: '问答和求助',
    color: '#ef4444',
    postCount: 8,
  },
  {
    id: 3,
    name: '资源分享',
    description: '资源分享',
    color: '#10b981',
    postCount: 23,
  },
  {
    id: 4,
    name: '闲聊灌水',
    description: '闲聊和灌水',
    color: '#f59e0b',
    postCount: 31,
  },
  {
    id: 5,
    name: '项目展示',
    description: '项目展示',
    color: '#8b5cf6',
    postCount: 12,
  },
]

// 生成随机日期（最近30天内）
const getRandomDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// 假标签数据（带不同的postCount用于3D滚动效果）
export const mockTags = [
  {
    id: 1,
    name: 'React',
    postCount: 5,
    latestPostDate: getRandomDate(),
  },
  {
    id: 2,
    name: 'Vue',
    postCount: 3,
    latestPostDate: getRandomDate(),
  },
  {
    id: 3,
    name: 'JavaScript',
    postCount: 8,
    latestPostDate: getRandomDate(),
  },
  {
    id: 4,
    name: 'TypeScript',
    postCount: 4,
    latestPostDate: getRandomDate(),
  },
  {
    id: 5,
    name: 'Node.js',
    postCount: 6,
    latestPostDate: getRandomDate(),
  },
  {
    id: 6,
    name: 'Python',
    postCount: 7,
    latestPostDate: getRandomDate(),
  },
  {
    id: 7,
    name: 'Java',
    postCount: 2,
    latestPostDate: getRandomDate(),
  },
  {
    id: 8,
    name: 'Go',
    postCount: 3,
    latestPostDate: getRandomDate(),
  },
  {
    id: 9,
    name: 'Rust',
    postCount: 2,
    latestPostDate: getRandomDate(),
  },
  {
    id: 10,
    name: 'Docker',
    postCount: 4,
    latestPostDate: getRandomDate(),
  },
  {
    id: 11,
    name: 'Kubernetes',
    postCount: 2,
    latestPostDate: getRandomDate(),
  },
  {
    id: 12,
    name: 'AWS',
    postCount: 3,
    latestPostDate: getRandomDate(),
  },
  {
    id: 13,
    name: 'Git',
    postCount: 5,
    latestPostDate: getRandomDate(),
  },
  {
    id: 14,
    name: 'Linux',
    postCount: 4,
    latestPostDate: getRandomDate(),
  },
  {
    id: 15,
    name: 'Database',
    postCount: 6,
    latestPostDate: getRandomDate(),
  },
]

// 模拟API延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟分类API
export const mockCategoryAPI = {
  getCategories: async () => {
    await delay(300)
    return {
      data: mockCategories,
    }
  },
}

// 模拟标签API
export const mockTagAPI = {
  getTags: async (params = {}) => {
    await delay(300)
    const limit = params.limit || 10
    return {
      data: mockTags.slice(0, limit),
    }
  },
}

