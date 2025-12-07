# 重新部署指南
### 在服务器上执行以下命令：

```bash
# 1. 进入项目目录
cd /opt/ReForum

git fetch origin

git checkout v1.6.2

# 2. 拉取最新代码
git pull origin master

git pull origin v1.5.8

git pull origin v1.6.2

git pull origin v1.7.0

git pull origin v1.8.0

# 3. 停止现有容器
docker-compose down

# 4. 重新构建镜像（不使用缓存，确保使用最新代码）
docker-compose build --no-cache

docker-compose build --no-cache frontend

# 5. 启动容器
docker-compose up -d

docker-compose up -d frontend

# 6. 查看容器状态
docker-compose ps

# 7. 查看日志（确认服务正常启动）
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 frontend
```

### （可选）前端容器内启用 API 与上传代理

仓库已在 `frontend/nginx.conf` 中开启：
- `location /api` 代理到容器内 `backend:3000`
- `location /uploads` 代理到容器内 `backend:3000/uploads`

若希望前端同域访问后端，请在构建前端镜像时将环境变量设置为：

```bash
# docker-compose.yml 已默认传入
VITE_API_BASE_URL=/api
```

### 服务器 Nginx 配置 API 域名（推荐）

如果使用独立域名 `api.reforum.space`，可使用模板：`server/nginx/api.reforum.space.conf`

```bash
sudo cp server/nginx/api.reforum.space.conf /etc/nginx/sites-available/api.reforum.space
sudo ln -sf /etc/nginx/sites-available/api.reforum.space /etc/nginx/sites-enabled/api.reforum.space
sudo nginx -t && sudo systemctl reload nginx
```

验证上传直出是否可用：
```bash
curl -I https://api.reforum.space/uploads/<实际文件名>
```

## 🔍 验证部署

### 1. 检查容器状态

```bash
docker ps
```

应该看到三个容器都在运行：
- `reforum-frontend-1`
- `reforum-backend-1`
- `reforum-db-1`

### 2. 检查后端健康状态

```bash
curl http://localhost:3000/health
```

应该返回 `200 OK`。

### 3. 检查前端

访问 `https://reforum.space`，确认网站正常加载。

### 4. 测试验证码功能

1. 打开注册页面
2. 输入邮箱地址
3. 点击"获取验证码"
4. 检查是否成功发送（查看后端日志）

## 🐛 如果遇到问题

### 构建失败

```bash
# 查看详细错误
docker-compose build --no-cache 2>&1 | tee build.log

# 检查 Dockerfile 是否正确
cat frontend/Dockerfile
cat backend/Dockerfile
```

### 容器启动失败

```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# 检查容器状态
docker-compose ps
```

### 数据库连接问题

```bash
# 检查数据库容器
docker exec -it reforum-db-1 psql -U HuangWeiLong -d forum_db -c "SELECT 1;"

# 检查后端环境变量
docker exec reforum-backend-1 env | grep DB_
```

## 📝 快速部署命令（一键执行）

```bash
cd /opt/ReForum && \
git pull origin master && \
docker-compose down && \
docker-compose build --no-cache && \
docker-compose up -d && \
sleep 10 && \
docker-compose ps && \
echo "部署完成！"
```

## ⚠️ 注意事项

1. **数据备份**：部署前建议备份数据库（如果需要）
2. **端口冲突**：确保 8080、3000、5433 端口未被占用
3. **环境变量**：确认 `docker-compose.yml` 中的环境变量正确
4. **磁盘空间**：确保有足够的磁盘空间用于构建镜像

## 🔄 回滚（如果需要）

如果新版本有问题，可以回滚到之前的版本：

```bash
# 查看提交历史
git log --oneline -10

# 回滚到指定提交
git reset --hard <commit-hash>

# 重新部署
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

