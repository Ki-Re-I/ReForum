# 修复端口冲突问题

## 问题描述

错误信息：`Bind for 0.0.0.0:5432 failed: port is already allocated`

这表示 5432 端口已经被其他服务占用。

## 解决方案

### 方案1: 移除数据库端口映射（推荐）

数据库只需要在 Docker 网络内部访问，不需要暴露到外部。我已经更新了 `docker-compose.yml`，移除了数据库的端口映射。

**优点：**
- 更安全（数据库不对外暴露）
- 避免端口冲突
- 符合生产环境最佳实践

**修改内容：**
```yaml
db:
  image: postgres:15-alpine
  # 端口映射已注释
  # ports:
  #   - "5432:5432"
```

### 方案2: 使用不同的端口

如果需要从外部访问数据库，可以修改为其他端口：

```yaml
db:
  ports:
    - "5433:5432"  # 使用 5433 端口
```

### 方案3: 停止占用端口的服务

如果服务器上有其他 PostgreSQL 实例在运行：

```bash
# 检查占用端口的进程
sudo lsof -i :5432
# 或
sudo netstat -tulpn | grep 5432

# 停止服务（根据实际情况选择）
sudo systemctl stop postgresql
# 或
sudo service postgresql stop
```

## 重新部署

修改配置后，重新启动服务：

```bash
# 停止现有容器
docker-compose down

# 重新启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 验证

```bash
# 检查容器状态
docker-compose ps

# 检查后端是否能连接数据库
docker-compose logs backend

# 测试健康检查
curl http://localhost:3000/health
```

## 注意事项

1. **数据库访问**：移除端口映射后，只能通过 Docker 网络内部访问数据库
2. **备份数据**：如果需要从外部备份，可以使用：
   ```bash
   docker-compose exec db pg_dump -U HuangWeiLong forum_db > backup.sql
   ```
3. **调试**：如果需要临时访问数据库，可以：
   ```bash
   docker-compose exec db psql -U HuangWeiLong -d forum_db
   ```

---

**推荐使用方案1，既安全又简单！** ✅

