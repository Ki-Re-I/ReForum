# REForum 后端 API

基于 Node.js (Express) 和 PostgreSQL 的论坛系统后端 API。

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web 框架
- **PostgreSQL** - 数据库
- **JWT** - 身份认证
- **Resend** - 邮件服务
- **bcryptjs** - 密码加密
- **express-validator** - 请求验证

## 项目结构

```
backend/
├── config/
│   └── database.js          # 数据库连接配置
├── controllers/             # 控制器（处理业务逻辑）
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── categoryController.js
│   └── tagController.js
├── models/                  # 数据模型（数据库操作）
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Category.js
│   └── Tag.js
├── routes/                  # 路由定义
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── comments.js
│   ├── categories.js
│   └── tags.js
├── middleware/              # 中间件
│   ├── auth.js             # JWT 认证
│   └── validation.js       # 请求验证
├── services/                # 服务层
│   ├── emailService.js     # 邮件服务（Resend）
│   └── verificationCodeService.js  # 验证码服务
├── app.js                   # 应用入口
├── package.json
└── .env                     # 环境变量（需要创建）
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env` 并填写配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reforum
DB_USER=postgres
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Resend 邮件配置（用于发送验证码）
RESEND_API_KEY=re_your_resend_api_key
# 注意：需要在 Resend 控制台配置发件域名，或使用默认的 onboarding@resend.dev

# 应用配置
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### 3. 创建数据库

确保 PostgreSQL 数据库已创建，并执行 `database_schema.sql` 文件创建表结构。

### 4. 启动服务器

开发模式（使用 nodemon）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出（需要认证）

### 用户相关

- `GET /api/users/profile` - 获取当前用户资料（需要认证）
- `PUT /api/users/profile` - 更新当前用户资料（需要认证）
- `GET /api/users/:userId` - 获取指定用户公开资料

### 帖子相关

- `GET /api/posts` - 获取帖子列表（支持分页、排序、筛选）
- `GET /api/posts/:postId` - 获取帖子详情
- `POST /api/posts` - 创建帖子（需要认证）
- `PUT /api/posts/:postId` - 更新帖子（需要认证，仅作者）

### 评论相关

- `GET /api/posts/:postId/comments` - 获取帖子评论列表
- `POST /api/posts/:postId/comments` - 发表评论（需要认证）
- `POST /api/comments/:commentId/reply` - 回复评论（需要认证）

### 分类和标签

- `GET /api/categories` - 获取所有分类
- `GET /api/tags` - 获取热门标签

## 认证方式

API 使用 JWT (JSON Web Token) 进行身份认证。

### 获取 Token

通过登录或注册接口获取 token：

```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 使用 Token

在需要认证的请求中，在请求头添加：

```
Authorization: Bearer <your_token>
```

## 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "error": "ERROR_CODE",
  "message": "错误描述",
  "details": "详细错误信息（可选）"
}
```

常见错误代码：
- `VALIDATION_ERROR` - 请求参数验证失败
- `UNAUTHORIZED` - 未授权访问
- `FORBIDDEN` - 无权限
- `NOT_FOUND` - 资源不存在
- `INTERNAL_ERROR` - 服务器内部错误

## 开发

### 代码规范

- 使用 ES6+ 语法
- 遵循 MVC 架构模式
- 使用 async/await 处理异步操作
- 统一错误处理

### 调试

开发模式下，服务器会自动重启（使用 nodemon）。

查看日志：
- 控制台输出包含请求日志和错误信息
- 数据库查询日志会显示执行时间和结果

## 部署

### 环境变量

确保生产环境正确配置所有环境变量，特别是：
- `JWT_SECRET` - 使用强随机字符串
- `DB_PASSWORD` - 数据库密码
- `RESEND_API_KEY` - Resend API 密钥

### 安全建议

1. 使用 HTTPS
2. 配置 CORS 白名单
3. 启用速率限制
4. 定期更新依赖
5. 使用环境变量存储敏感信息

## 许可证

ISC

