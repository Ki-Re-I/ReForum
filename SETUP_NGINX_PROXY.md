# 配置 Nginx 反向代理

## 问题

端口 80 被系统 Nginx 占用，Docker 容器无法绑定。解决方案是使用系统 Nginx 作为反向代理。

## 解决方案

### 1. 更新 Docker Compose 配置

已更新 `docker-compose.yml`：
- 前端容器：从 `80:80` 改为 `127.0.0.1:8080:80`（只监听本地）
- 后端容器：从 `3000:3000` 改为 `127.0.0.1:3000:3000`（只监听本地）

### 2. 配置系统 Nginx

在服务器上执行以下步骤：

#### 步骤 1：复制 Nginx 配置文件

```bash
cd /opt/ReForum
sudo cp nginx-reforum.conf /etc/nginx/sites-available/reforum.space
```

#### 步骤 2：创建软链接

```bash
sudo ln -s /etc/nginx/sites-available/reforum.space /etc/nginx/sites-enabled/
```

#### 步骤 3：为 API 子域名申请 SSL 证书

```bash
sudo certbot --nginx -d api.reforum.space
```

#### 步骤 4：测试 Nginx 配置

```bash
sudo nginx -t
```

#### 步骤 5：重新加载 Nginx

```bash
sudo systemctl reload nginx
```

#### 步骤 6：重新部署 Docker 容器

```bash
cd /opt/ReForum
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose logs --tail=50
```

### 3. 验证配置

访问以下地址确认一切正常：
- 前端：`https://reforum.space`
- API：`https://api.reforum.space/health`

## 架构说明

```
用户请求
    ↓
系统 Nginx (443端口, SSL)
    ↓
Docker 容器
    ├─ 前端: localhost:8080
    └─ 后端: localhost:3000
```

## 优势

1. ✅ 使用系统 Nginx 处理 SSL/TLS
2. ✅ 利用已配置的 Let's Encrypt 证书
3. ✅ 避免端口冲突
4. ✅ 更好的性能和安全性
5. ✅ 统一的入口点

## 故障排查

### 如果 Nginx 配置测试失败

```bash
# 查看详细错误
sudo nginx -t

# 检查配置文件语法
sudo nginx -T | grep -A 10 -B 10 error
```

### 如果容器无法启动

```bash
# 检查端口占用
sudo netstat -tulpn | grep -E '8080|3000'

# 查看容器日志
docker-compose logs frontend
docker-compose logs backend
```

### 如果无法访问

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查 Docker 容器状态
docker-compose ps
```

