# 假数据使用说明

## 概述

为了便于本地开发和预览UI效果，项目提供了假数据（Mock Data）功能。无需连接后端数据库即可查看标签和分类的视觉效果。

## 使用方法

### 方法1：环境变量（推荐）

在 `frontend/.env` 文件中设置：

```env
VITE_USE_MOCK_DATA=true
```

设置为 `true` 使用假数据，设置为 `false` 使用真实API。

### 方法2：代码中修改

在以下文件中修改 `USE_MOCK_DATA` 常量：

- `frontend/src/components/Sidebar.jsx`
- `frontend/src/components/RightSidebar.jsx`
- `frontend/src/services/api.js` (帖子 API 会自动使用 mock 数据)

```javascript
const USE_MOCK_DATA = true  // 使用假数据
// 或
const USE_MOCK_DATA = false // 使用真实API
```

**注意**：帖子 API 会自动根据环境变量 `VITE_USE_MOCK_DATA` 来决定使用假数据还是真实 API，无需单独配置。

## 假数据内容

### 分类数据（5个）
- 技术讨论 (15 posts)
- 问答求助 (8 posts)
- 资源分享 (23 posts)
- 闲聊灌水 (31 posts)
- 项目展示 (12 posts)

### 标签数据（15个）
包含不同 postCount 的标签，用于展示3D滚动效果：
- React (5)
- Vue (3)
- JavaScript (8)
- TypeScript (4)
- Node.js (6)
- Python (7)
- Java (2)
- Go (3)
- Rust (2)
- Docker (4)
- Kubernetes (2)
- AWS (3)
- Git (5)
- Linux (4)
- Database (6)

### 帖子数据（25个）
包含完整的帖子数据，用于测试和预览：
- 涵盖所有分类的帖子
- 包含不同的标签组合
- 随机生成浏览量、点赞数、评论数
- 部分帖子包含图片预览
- 支持按分类、标签筛选
- 支持按时间、热度排序
- 支持分页功能

## 注意事项

1. **默认启用假数据**：代码中默认 `USE_MOCK_DATA = true`，可以直接预览效果
2. **API失败自动回退**：如果真实API失败，会自动使用假数据作为后备
3. **修改假数据**：编辑 `frontend/src/data/mockData.js` 文件可以自定义假数据

## 切换回真实API

当需要连接真实后端时：

1. 设置环境变量 `VITE_USE_MOCK_DATA=false`
2. 或修改代码中的 `USE_MOCK_DATA = false`
3. 确保后端服务正在运行
4. 重启前端开发服务器

