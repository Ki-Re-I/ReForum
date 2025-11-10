# REForum - 论坛系统

一个现代化的论坛社区系统，参考 Reddit 的设计理念，采用前后端分离架构。

## 项目结构

```
REForum/
├── frontend/          # React 前端应用
├── backend/           # Spring Boot 后端应用
├── openapi.yaml       # API 规范文档
├── docker-compose.yml # Docker 编排配置
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
- Java
- Spring Boot
- PostgreSQL

### 部署
- Docker
- Docker Compose
- Nginx

## 功能特性

- ✅ 用户认证（注册、登录、登出）
- ✅ 用户资料管理
- ✅ 帖子发布、编辑、查看
- ✅ 评论和回复功能
- ✅ 版块和标签分类
- ✅ 帖子排序（最新、热门）
- ✅ 响应式设计
- ✅ 现代化 UI（参考 Reddit）

## 快速开始

### 前置要求

- Node.js 20+
- Java 17+
- Docker & Docker Compose（可选）
- PostgreSQL（如果不用 Docker）

### 开发模式

#### 前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 启动

#### 后端

```bash
cd backend
./mvnw spring-boot:run
```

后端将在 http://localhost:8080 启动

### Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## API 文档

API 规范定义在 `openapi.yaml` 文件中。

查看 API 文档：
- 本地开发：访问 http://localhost:3000/api-docs
- GitHub Pages：自动部署到 GitHub Pages

## 环境配置

### 前端环境变量

创建 `frontend/.env`：

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 后端配置

配置文件位于 `backend/src/main/resources/application.yml`

## 项目开发

### 前端开发

```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run lint         # 代码检查
```

### 后端开发

```bash
cd backend
./mvnw clean install # 编译项目
./mvnw spring-boot:run # 运行应用
```

## GitHub Actions

项目配置了以下 GitHub Actions 工作流：

1. **CI** - 持续集成，验证代码质量
2. **OpenAPI 验证** - 验证 API 规范
3. **API 文档生成** - 自动生成并部署 API 文档
4. **文档预览** - PR 时生成文档预览

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- 邮箱: 3571676852@qq.com
- 项目维护者: Ki Re I




