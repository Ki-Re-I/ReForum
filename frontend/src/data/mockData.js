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

// 假用户数据
const mockUsers = [
  { id: 1, username: '开发者小明', avatar: '/avatars/admin1.jpg', tag: 'official' }, // 官方称号
  { id: 2, username: '技术达人', avatar: '/avatars/admin2.jpg', tag: '全栈工程师' },
  { id: 3, username: '前端工程师', avatar: null, tag: 'Vue爱好者' },
  { id: 4, username: '后端架构师', avatar: null, tag: 'Node.js大师' },
  { id: 5, username: '全栈开发者', avatar: null, tag: 'TypeScript玩家' },
  { id: 6, username: 'UI设计师', avatar: null, tag: '设计达人' },
  { id: 7, username: '产品经理', avatar: null, tag: '产品专家' },
  { id: 8, username: '测试工程师', avatar: null, tag: 'QA工程师' },
]

// 生成假帖子数据
const generateMockPosts = () => {
  const postTitles = [
    'React 18 新特性深度解析：并发渲染与自动批处理',
    'Vue 3 Composition API 最佳实践分享',
    'TypeScript 5.0 新特性：装饰器与类型系统增强',
    'Node.js 性能优化实战：从零到百万并发',
    'Docker 容器化部署完整指南',
    'Kubernetes 集群管理经验分享',
    '前端工程化：从 Webpack 到 Vite 的迁移之路',
    '微服务架构设计模式与实践',
    'GraphQL vs REST API：如何选择？',
    '数据库设计：从关系型到 NoSQL 的思考',
    'Git 工作流最佳实践：Git Flow vs GitHub Flow',
    'Linux 服务器运维实战技巧',
    'AWS 云服务架构设计指南',
    'Python 异步编程：asyncio 深入理解',
    'Go 语言并发编程：Goroutine 与 Channel',
    'Rust 内存安全机制解析',
    'JavaScript 闭包与作用域链详解',
    'CSS Grid 布局实战案例',
    'Web 性能优化：从加载到渲染的完整方案',
    '移动端适配方案：rem、vw、flexible 对比',
    'PWA 渐进式 Web 应用开发指南',
    'WebAssembly 在浏览器中的应用',
    '前端安全：XSS、CSRF 防护实践',
    'SEO 优化：从技术到内容的全面策略',
    '代码审查：如何写出高质量的代码',
  ]

  const postContents = [
    `React 18 引入了许多令人兴奋的新特性，其中最引人注目的是并发渲染（Concurrent Rendering）和自动批处理（Automatic Batching）。

## 并发渲染

并发渲染允许 React 中断正在进行的渲染工作，优先处理更紧急的更新。这意味着用户界面可以保持响应，即使在处理大量数据时也是如此。

\`\`\`javascript
// 使用 startTransition 标记非紧急更新
import { startTransition } from 'react'

function handleClick() {
  // 紧急更新：立即执行
  setInputValue(input)
  
  // 非紧急更新：可以中断
  startTransition(() => {
    setSearchResults(results)
  })
}
\`\`\`

## 自动批处理

React 18 现在会自动批处理所有状态更新，无论是在事件处理器中还是在异步操作中。这减少了不必要的重新渲染，提高了性能。`,

    `Vue 3 的 Composition API 为我们提供了更灵活的方式来组织组件逻辑。本文将分享一些最佳实践。

## 使用 setup 语法糖

\`\`\`vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('组件已挂载')
})
</script>
\`\`\`

## 组合式函数

将可复用的逻辑提取到组合式函数中，可以提高代码的可维护性。`,

    `TypeScript 5.0 带来了许多令人期待的新特性，特别是装饰器和类型系统的增强。

## 装饰器支持

TypeScript 5.0 现在原生支持装饰器，无需额外的配置。

\`\`\`typescript
function Log(target: any, propertyKey: string) {
  console.log(\`访问属性: \${propertyKey}\`)
}

class MyClass {
  @Log
  myMethod() {
    // ...
  }
}
\`\`\`

## 类型系统增强

新的类型系统提供了更好的类型推断和错误检查。`,

    `Node.js 性能优化是一个复杂的话题，涉及多个方面。本文将分享一些实战经验。

## 异步 I/O 优化

充分利用 Node.js 的异步 I/O 特性，避免阻塞事件循环。

## 内存管理

合理使用流（Stream）处理大文件，避免将整个文件加载到内存中。

## 集群模式

使用 Node.js 的集群模块，充分利用多核 CPU 的优势。`,

    `Docker 容器化是现代应用部署的标准方式。本文将提供一个完整的部署指南。

## Dockerfile 最佳实践

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## 多阶段构建

使用多阶段构建可以减小镜像大小，提高安全性。`,

    `Kubernetes 是容器编排的事实标准。本文将分享一些集群管理的经验。

## 资源管理

合理设置 Pod 的资源请求和限制，确保集群资源的有效利用。

## 健康检查

配置适当的健康检查，确保应用的高可用性。

## 自动扩缩容

使用 HPA（Horizontal Pod Autoscaler）实现自动扩缩容。`,

    `前端工程化是现代前端开发的重要组成部分。本文将分享从 Webpack 到 Vite 的迁移经验。

## 为什么选择 Vite？

- 更快的开发服务器启动速度
- 基于 ESM 的热更新
- 更好的构建性能

## 迁移步骤

1. 安装 Vite
2. 配置 vite.config.js
3. 更新构建脚本
4. 处理兼容性问题`,

    `微服务架构是现代应用架构的主流选择。本文将介绍一些设计模式和实践。

## 服务拆分原则

- 按业务领域拆分
- 保持服务独立性
- 避免过度拆分

## 通信方式

- 同步：REST API、GraphQL
- 异步：消息队列、事件总线

## 数据管理

- 每个服务拥有独立数据库
- 使用 Saga 模式处理分布式事务`,

    `GraphQL 和 REST API 各有优势。本文将帮助你做出选择。

## GraphQL 优势

- 精确获取所需数据
- 强类型系统
- 单一端点

## REST API 优势

- 简单易懂
- 缓存友好
- 工具支持完善

## 如何选择？

根据项目需求、团队经验和工具支持来决定。`,

    `数据库设计是应用架构的基础。本文将探讨从关系型到 NoSQL 的思考。

## 关系型数据库

适合需要强一致性和复杂查询的场景。

## NoSQL 数据库

适合需要高可扩展性和灵活数据模型的场景。

## 混合方案

许多应用采用混合方案，根据不同的数据特点选择不同的数据库。`,
  ]

  const posts = []
  for (let i = 0; i < 25; i++) {
    const category = mockCategories[i % mockCategories.length]
    const author = mockUsers[i % mockUsers.length]
    const tags = []
    const tagCount = Math.floor(Math.random() * 3) + 1 // 1-3 个标签
    for (let j = 0; j < tagCount; j++) {
      const tag = mockTags[Math.floor(Math.random() * mockTags.length)]
      if (!tags.find(t => t.id === tag.id)) {
        tags.push(tag)
      }
    }

    // 随机生成一些帖子包含图片
    const hasImage = Math.random() > 0.7 // 30% 的帖子有图片
    let content = postContents[i % postContents.length] || postContents[0]
    if (hasImage && i < 5) {
      // 前5个帖子可能有图片
      const imageUrl = `/avatars/admin${(i % 2) + 1}.jpg`
      content = `![示例图片](${imageUrl})\n\n${content}`
    }

    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    // 确保日期有效
    const createdAt = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()

    posts.push({
      id: i + 1,
      title: postTitles[i] || `示例帖子 ${i + 1}`,
      content: content,
      excerpt: content.substring(0, 150) + '...',
      author: {
        id: author.id,
        username: author.username,
        avatar: author.avatar,
        tag: author.tag || '',
      },
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
      },
      tags: tags,
      viewCount: Math.floor(Math.random() * 1000) + 10,
      commentCount: Math.floor(Math.random() * 50),
      likeCount: Math.floor(Math.random() * 100),
      createdAt: createdAt,
      updatedAt: createdAt,
      liked: Math.random() > 0.7, // 30% 的概率已点赞
    })
  }

  return posts
}

export const mockPosts = generateMockPosts()

// 模拟帖子API
export const mockPostAPI = {
  getPosts: async (params = {}) => {
    await delay(500)
    
    let filteredPosts = [...mockPosts]
    
    // 按分类筛选
    if (params.category) {
      filteredPosts = filteredPosts.filter(
        post => post.category.id === parseInt(params.category)
      )
    }
    
    // 按标签筛选
    if (params.tag) {
      filteredPosts = filteredPosts.filter(
        post => post.tags.some(tag => tag.name === params.tag)
      )
    }
    
    // 按日期筛选
    if (params.date) {
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.createdAt).toISOString().split('T')[0]
        return postDate === params.date
      })
    }
    
    // 排序
    if (params.sort === 'hot') {
      filteredPosts.sort((a, b) => b.likeCount - a.likeCount)
    } else {
      // 默认按时间排序
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    
    // 分页
    const page = params.page || 1
    const limit = params.limit || 20
    const offset = (page - 1) * limit
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)
    
    return {
      data: {
        data: paginatedPosts,
        pagination: {
          page: page,
          limit: limit,
          total: filteredPosts.length,
          totalPages: Math.ceil(filteredPosts.length / limit),
        },
      },
    }
  },
  
  getPost: async (postId) => {
    await delay(300)
    const post = mockPosts.find(p => p.id === parseInt(postId))
    if (!post) {
      throw new Error('帖子不存在')
    }
    return {
      data: post,
    }
  },
  
  toggleLike: async (postId) => {
    await delay(200)
    const post = mockPosts.find(p => p.id === parseInt(postId))
    if (!post) {
      throw new Error('帖子不存在')
    }
    post.liked = !post.liked
    post.likeCount += post.liked ? 1 : -1
    post.likeCount = Math.max(0, post.likeCount)
    return {
      data: {
        liked: post.liked,
        likeCount: post.likeCount,
      },
    }
  },
  
  checkLikeStatus: async (postId) => {
    await delay(200)
    const post = mockPosts.find(p => p.id === parseInt(postId))
    if (!post) {
      throw new Error('帖子不存在')
    }
    return {
      data: {
        liked: post.liked || false,
      },
    }
  },
}

