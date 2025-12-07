# 数据库迁移脚本执行指南

本文档列出了所有需要执行的数据库迁移脚本及其执行顺序。

## 迁移脚本列表

### 1. 基础功能迁移（如果尚未执行）

这些脚本可能在之前的版本中已经执行过，如果数据库已经存在这些表，可以跳过。

#### 1.1 通知表
```bash
psql -U postgres -d reforum -f backend/migrations/add_notifications_table.sql
```
**说明**：创建 `notifications` 表，用于存储用户通知。

#### 1.2 帖子点赞表
```bash
psql -U postgres -d reforum -f backend/migrations/add_post_likes_table.sql
```
**说明**：创建 `post_likes` 表，用于记录帖子点赞。**注意**：`add_user_exp_and_received_likes.sql` 依赖此表。

#### 1.3 帖子浏览表
```bash
psql -U postgres -d reforum -f backend/migrations/add_post_views_table.sql
```
**说明**：创建 `post_views` 表，用于记录帖子浏览次数。

### 2. v1.9.0 版本迁移（必须执行）

#### 2.1 用户称号字段（必须执行）
```bash
psql -U postgres -d reforum -f backend/migrations/add_user_tag_column.sql
```
**说明**：为 `users` 表添加 `tag` 字段，用于存储用户自定义称号。

**变更内容**：
- 添加 `tag VARCHAR(20) DEFAULT NULL` 字段

#### 2.2 用户名和称号修改时间跟踪（必须执行）
```bash
psql -U postgres -d reforum -f backend/migrations/add_username_tag_update_tracking.sql
```
**说明**：为 `users` 表添加 `username_updated_at` 和 `tag_updated_at` 字段，用于实现30天修改限制。

**变更内容**：
- 添加 `username_updated_at TIMESTAMP` 字段
- 添加 `tag_updated_at TIMESTAMP` 字段

**依赖关系**：此脚本依赖 `tag` 字段，请确保已执行 `add_user_tag_column.sql`。

#### 2.3 用户经验值和获赞数（必须执行）
```bash
psql -U postgres -d reforum -f backend/migrations/add_user_exp_and_received_likes.sql
```
**说明**：为 `users` 表添加 `exp` 字段，创建 `user_received_likes` 视图。

**变更内容**：
- 添加 `exp INTEGER DEFAULT 0 NOT NULL` 字段到 `users` 表
- 创建 `user_received_likes` 视图（统计用户获赞数）
- 创建 `idx_users_exp` 索引

#### 2.4 用户称号唯一性约束（必须执行）
```bash
psql -U postgres -d reforum -f backend/migrations/add_user_tag_unique_constraint.sql
```
**说明**：为 `users` 表的 `tag` 字段添加唯一性约束，确保每个用户的称号都是唯一的。

**变更内容**：
- 清理可能存在的重复 tag（保留最早用户的 tag）
- 创建 `idx_users_tag_unique` 唯一索引（允许 NULL 值）
- 允许多个用户没有称号（NULL），但不允许多个用户使用相同的非空称号

**依赖关系**：此脚本依赖 `post_likes` 表，请确保已执行 `add_post_likes_table.sql`。

**依赖关系**：此脚本依赖 `tag` 字段，请确保已执行 `add_user_tag_column.sql`。

## 完整执行顺序

### 首次部署（全新数据库）

如果这是首次部署，需要按以下顺序执行所有脚本：

#### 如果使用 Docker（推荐）

```bash
# 首先确认数据库容器名称
docker ps | grep postgres

# 1. 基础功能表（根据您的 docker-compose.yml 配置）
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_notifications_table.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_post_likes_table.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_post_views_table.sql

# 2. v1.9.0 新功能（按顺序执行）
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_tag_column.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_username_tag_update_tracking.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_exp_and_received_likes.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_tag_unique_constraint.sql
```

**注意**：请根据实际的容器名称、数据库名称和用户名调整命令。

#### 如果已安装 psql 客户端

```bash
# 1. 基础功能表
psql -U postgres -d reforum -f backend/migrations/add_notifications_table.sql
psql -U postgres -d reforum -f backend/migrations/add_post_likes_table.sql
psql -U postgres -d reforum -f backend/migrations/add_post_views_table.sql

# 2. v1.9.0 新功能（按顺序执行）
psql -U postgres -d reforum -f backend/migrations/add_user_tag_column.sql
psql -U postgres -d reforum -f backend/migrations/add_username_tag_update_tracking.sql
psql -U postgres -d reforum -f backend/migrations/add_user_exp_and_received_likes.sql
psql -U postgres -d reforum -f backend/migrations/add_user_tag_unique_constraint.sql
```

### 从 v1.8.0 升级到 v1.9.0

如果数据库已经存在（从 v1.8.0 或更早版本升级），只需要执行 v1.9.0 的迁移脚本：

```bash
# v1.9.0 新功能（按顺序执行）
psql -U postgres -d reforum -f backend/migrations/add_user_tag_column.sql
psql -U postgres -d reforum -f backend/migrations/add_username_tag_update_tracking.sql
psql -U postgres -d reforum -f backend/migrations/add_user_exp_and_received_likes.sql
psql -U postgres -d reforum -f backend/migrations/add_user_tag_unique_constraint.sql
```

## 使用 Docker 执行

如果使用 Docker 部署，可以使用以下命令：

### 方法 1: 通过 Docker 容器执行（推荐，无需安装 psql 客户端）

```bash
# 首先查看数据库容器名称
docker ps | grep postgres

# 执行迁移脚本（根据 docker-compose.yml，数据库名是 forum_db，用户是 HuangWeiLong）
# 如果容器名称是 reforum-db-1：
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_tag_column.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_username_tag_update_tracking.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_exp_and_received_likes.sql
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/migrations/add_user_tag_unique_constraint.sql

# 或者如果容器名称不同，使用以下命令查找：
# docker ps --format "{{.Names}}" | grep -i db
```

**重要提示**：
- 数据库名称：`forum_db`（不是 `reforum`）
- 数据库用户：`HuangWeiLong`（不是 `postgres`）
- 容器名称：通常是 `reforum-db-1` 或 `项目名-db-1`，请先运行 `docker ps` 确认

### 方法 2: 复制文件到容器内执行

```bash
# 复制文件到容器
docker cp backend/migrations/add_user_tag_column.sql reforum-db-1:/tmp/
docker cp backend/migrations/add_username_tag_update_tracking.sql reforum-db-1:/tmp/
docker cp backend/migrations/add_user_exp_and_received_likes.sql reforum-db-1:/tmp/
docker cp backend/migrations/add_user_tag_unique_constraint.sql reforum-db-1:/tmp/

# 在容器内执行
docker exec -i reforum-db-1 psql -U postgres -d reforum -f /tmp/add_user_tag_column.sql
docker exec -i reforum-db-1 psql -U postgres -d reforum -f /tmp/add_username_tag_update_tracking.sql
docker exec -i reforum-db-1 psql -U postgres -d reforum -f /tmp/add_user_exp_and_received_likes.sql
docker exec -i reforum-db-1 psql -U postgres -d reforum -f /tmp/add_user_tag_unique_constraint.sql
```

### 方法 3: 安装 postgresql-client（如果需要在主机上直接执行）

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-client

# 然后就可以在主机上直接执行
psql -h localhost -p 5432 -U postgres -d reforum -f backend/migrations/add_user_tag_column.sql
psql -h localhost -p 5432 -U postgres -d reforum -f backend/migrations/add_username_tag_update_tracking.sql
psql -h localhost -p 5432 -U postgres -d reforum -f backend/migrations/add_user_exp_and_received_likes.sql
psql -h localhost -p 5432 -U postgres -d reforum -f backend/migrations/add_user_tag_unique_constraint.sql
```

## 验证迁移结果

执行迁移后，可以使用以下 SQL 验证：

```sql
-- 检查 users 表是否包含新字段
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('exp', 'username_updated_at', 'tag_updated_at');

-- 检查视图是否存在
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'user_received_likes';

-- 检查索引是否存在
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'users' 
AND indexname = 'idx_users_exp';
```

## 回滚方案

如果需要回滚 v1.9.0 的迁移，可以执行以下 SQL：

```sql
-- 删除视图
DROP VIEW IF EXISTS user_received_likes;

-- 删除索引
DROP INDEX IF EXISTS idx_users_exp;

-- 删除字段（注意：会丢失数据）
ALTER TABLE users DROP COLUMN IF EXISTS exp;
ALTER TABLE users DROP COLUMN IF EXISTS username_updated_at;
ALTER TABLE users DROP COLUMN IF EXISTS tag_updated_at;
```

## 注意事项

1. **备份数据库**：执行迁移前请务必备份数据库
2. **执行顺序**：请按照文档中的顺序执行，避免依赖关系错误
3. **重复执行**：所有脚本都使用了 `IF NOT EXISTS` 或 `IF EXISTS`，可以安全地重复执行
4. **数据丢失**：`exp` 字段有默认值 0，不会丢失现有数据
5. **性能影响**：`user_received_likes` 视图在每次查询时计算，对于大量数据可能需要优化

## 故障排除

### 错误：relation "post_likes" does not exist

**原因**：`add_user_exp_and_received_likes.sql` 依赖 `post_likes` 表。

**解决方案**：先执行 `add_post_likes_table.sql`。

### 错误：column "exp" already exists

**原因**：迁移脚本已经执行过。

**解决方案**：这是正常的，脚本使用了 `IF NOT EXISTS`，可以安全忽略。

### 错误：permission denied

**原因**：数据库用户权限不足。

**解决方案**：确保使用具有足够权限的数据库用户（通常是 `postgres` 或数据库所有者）。

