# REForum 部署检查清单

## ✅ 配置文件检查

### 1. 前端 Dockerfile (`frontend/Dockerfile`)
- ✅ API Base URL: `https://api.reforum.space/api`
- ✅ 正确复制所有源代码文件
- ✅ 包含 public 目录
- ✅ 使用多阶段构建

### 2. 后端 Dockerfile (`backend/Dockerfile`)
- ✅ 创建 uploads 目录
- ✅ 正确安装依赖
- ✅ 暴露端口 3000

### 3. Docker Compose (`docker-compose.yml`)
- ✅ 前端构建参数：`VITE_API_BASE_URL=https://api.reforum.space/api`
- ✅ 后端环境变量：
  - `FRONTEND_URL=https://reforum.space`
  - `APP_URL=https://api.reforum.space`
- ✅ 端口映射正确
- ✅ 卷挂载正确

### 4. Vite 配置 (`frontend/vite.config.js`)
- ✅ 文件扩展名解析配置正确
- ✅ 开发环境代理配置（仅开发时使用）

### 5. API 配置 (`frontend/src/services/api.js`)
- ✅ 使用环境变量：`import.meta.env.VITE_API_BASE_URL || '/api'`
- ✅ 生产环境：`https://api.reforum.space/api`
- ✅ 开发环境：`/api`（通过 Vite 代理）

### 6. Nginx 配置 (`nginx-reforum.conf`)
- ✅ 前端：`reforum.space` → `127.0.0.1:8080`
- ✅ API：`api.reforum.space` → `127.0.0.1:3000`
- ✅ SSL 证书配置正确

## 📋 部署步骤

### 在服务器上执行：

```bash
# 1. 进入项目目录
cd /opt/ReForum

# 2. 拉取最新代码
git pull origin master

# 3. 停止现有容器
docker-compose down

# 4. 重新构建镜像（清理缓存）
docker-compose build --no-cache

# 5. 启动所有服务
docker-compose up -d

# 6. 查看服务状态
docker-compose ps

# 7. 查看日志
docker-compose logs -f
```

### 或者使用部署脚本：

```bash
cd /opt/ReForum
git pull origin master
chmod +x deploy.sh
./deploy.sh
```

## 🔍 验证部署

### 1. 检查容器状态
```bash
docker-compose ps
```

应该看到三个容器都在运行：
- `reforum-frontend-1`
- `reforum-backend-1`
- `reforum-db-1`

### 2. 检查后端健康状态
```bash
curl http://localhost:3000/health
```

应该返回：
```json
{
  "status": "ok",
  "message": "服务运行正常",
  "database": "connected"
}
```

### 3. 检查前端
访问：https://reforum.space

### 4. 检查 API
访问：https://api.reforum.space/health

## ⚠️ 注意事项

1. **API 路径统一**：所有 API 调用使用 `/api` 路径（不是 `/api/v1`）
2. **环境变量**：生产环境使用 `https://api.reforum.space/api`
3. **图片上传**：图片存储在 `./backend/uploads` 目录，已配置卷挂载
4. **数据库**：数据持久化在 Docker volume `postgres_data` 中
5. **SSL 证书**：确保 SSL 证书已正确配置在服务器上

## 🐛 常见问题

### 问题 1：前端无法连接后端
- 检查 `VITE_API_BASE_URL` 环境变量是否正确
- 检查 Nginx 配置是否正确代理到后端

### 问题 2：图片无法显示
- 检查 `backend/uploads` 目录权限
- 检查 Nginx 是否正确代理 `/uploads` 路径

### 问题 3：构建失败
- 确保所有文件都已提交到 git
- 检查 `.dockerignore` 是否排除了必要文件
- 清理 Docker 缓存：`docker-compose build --no-cache`

## 📝 配置文件总结

| 文件 | API URL 配置 | 状态 |
|------|-------------|------|
| `frontend/Dockerfile` | `https://api.reforum.space/api` | ✅ |
| `docker-compose.yml` | `https://api.reforum.space/api` | ✅ |
| `frontend/src/services/api.js` | 环境变量或 `/api` | ✅ |
| `frontend/src/utils/debug.js` | 环境变量或 `/api` | ✅ |
| `backend/app.js` | `/api` | ✅ |

所有配置已统一并检查完毕！

