# REForum - Modern Forum System

An open-source, modern forum platform with a **separated frontend and backend** architecture.

---

# REForum - 现代论坛系统

一个论坛社区系统，采用 **前后端分离** 架构。

## 项目结构

```bash
REForum/
├── frontend/              # React 前端应用（Vite）
├── backend/               # Node.js/Express 后端服务
├── docs/                  # 部署与更新说明文档
├── logs/                  # 更新日志与 Bug 跟踪文档
├── openapi.yaml           # API 规范文档（OpenAPI 3）
├── docker-compose.yml     # Docker 编排配置
└── README.md
```

## 技术栈

### 前端
- React 18
- React Router 6
- Axios
- Vite
- React Icons
- date-fns

### 后端
- Node.js
- Express
- PostgreSQL

### 基础设施与部署
- Docker
- Docker Compose
- Nginx（前后端/静态资源反向代理）

## 功能特性

- ✅ 用户认证（注册、登录、登出）
- ✅ 邮箱验证码注册
- ✅ 用户资料管理与头像
- ✅ 帖子发布、编辑、删除、查看
- ✅ 评论与回复
- ✅ 帖子点赞、浏览统计与热门排序
- ✅ 版块与标签分类
- ✅ 搜索（按标题、内容、作者）
- ✅ 站内通知系统（新帖子通知）
- ✅ 站外邮箱通知（新帖子发布时自动发送邮件）
- ✅ 夜间模式与主题记忆
- ✅ 多语言界面（中/英/日），含协议、隐私、关于等页面
- ✅ 图片上传与帖子内图片展示
- ✅ 年龄验证与 Cookie 同意提示
- ✅ 响应式设计，移动端优化

更多细节可参考 `logs/UPDATE_LOG.md`、`logs/BUG_TRACKER.md` 与前端 `Changelog` / `Fixes` 页面。

## 本地开发

### 前置要求

- Node.js 18+（推荐 20+）
- npm（或 pnpm）
- Docker & Docker Compose（可选，用于一键部署）
- PostgreSQL（如不使用 Docker，请手动安装）

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

默认在 `http://localhost:5173`（或终端提示的端口）启动。

### 启动后端（本地 Node.js）

```bash
cd backend
npm install
npm run dev
```

默认在 `http://localhost:3000` 启动 API 服务（具体以 `backend/app.js` 与环境变量为准）。

### 使用 Docker 一键启动

```bash
# 在项目根目录
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

详细的重新部署流程请查看 `docs/REDEPLOY.md`。

## 环境配置

### 前端环境变量

在 `frontend/.env` 中配置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

如果通过 Nginx 反向代理到同域，可以改为：

```env
VITE_API_BASE_URL=/api
```

### 后端环境变量

后端示例环境变量请参考 `backend/env.example`，包括：

- 数据库连接（PostgreSQL）
- JWT/认证配置
- 邮件服务（Resend）用于验证码发送和新帖子通知
- 前端 URL（用于邮件中的链接）

## 文档

- `openapi.yaml`：完整 API 规范
- `docs/REDEPLOY.md`：线上环境重新部署指南
- `logs/UPDATE_LOG.md`：功能更新与修复记录
- `logs/BUG_TRACKER.md`：Bug 跟踪与修复记录

前端站点内还提供「更新日志」「问题修复」等可视化页面，方便非技术用户理解改动。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/YourFeature`
3. 提交更改：`git commit -m "Add YourFeature"`
4. 推送分支：`git push origin feature/YourFeature`
5. 发起 Pull Request

## 许可证

本项目采用 **MIT License** 开源协议，详见仓库根目录 `LICENSE` 文件。

## 联系方式

- 邮箱：3571676852@qq.com
- 项目维护者：Ki Re I

## 最后更新日期

2025年12月5日