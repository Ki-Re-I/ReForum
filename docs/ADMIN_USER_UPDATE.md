# 管理员直接更新用户数据指南

本文档说明如何在数据库中直接更新用户的 tag 和等级（exp）。

## 计算 70 级所需经验值

根据等级系统：
- 1→2 级需要 30 exp
- 2→3 级需要 35 exp
- 3→4 级需要 40 exp
- ...
- 69→70 级需要 370 exp

**70 级所需总经验值：13800 exp**

为了确保达到 70 级，建议设置为 **15000 exp**（略高于所需值）。

## 更新用户 tag 和等级

### 方法 1：通过用户名更新（推荐）

```bash
# 进入数据库容器
docker exec -it reforum-db-1 psql -U HuangWeiLong -d forum_db
```

然后在 PostgreSQL 命令行中执行：

```sql
-- 先查看用户信息（确认用户名）
SELECT id, username, tag, exp FROM users WHERE username = '用户名';

-- 更新用户的 tag 和 exp（将 '用户名' 替换为实际用户名）
UPDATE users 
SET tag = '官方', 
    exp = 15000,
    tag_updated_at = CURRENT_TIMESTAMP
WHERE username = '用户名';

-- 验证更新结果
SELECT id, username, tag, exp FROM users WHERE username = '用户名';
```

### 方法 2：通过用户 ID 更新

```sql
-- 先查看用户信息（确认用户 ID）
SELECT id, username, tag, exp FROM users WHERE id = 用户ID;

-- 更新用户的 tag 和 exp（将 用户ID 替换为实际 ID）
UPDATE users 
SET tag = '官方', 
    exp = 15000,
    tag_updated_at = CURRENT_TIMESTAMP
WHERE id = 用户ID;

-- 验证更新结果
SELECT id, username, tag, exp FROM users WHERE id = 用户ID;
```

### 方法 3：直接在命令行执行（无需进入交互模式）

```bash
# 通过用户名更新
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db -c "UPDATE users SET tag = '官方', exp = 15000, tag_updated_at = CURRENT_TIMESTAMP WHERE username = '用户名';"

# 通过用户 ID 更新
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db -c "UPDATE users SET tag = '官方', exp = 15000, tag_updated_at = CURRENT_TIMESTAMP WHERE id = 用户ID;"
```

## 注意事项

1. **tag 唯一性**：如果设置的 tag 已被其他用户使用，更新会失败。可以先检查：
   ```sql
   SELECT id, username, tag FROM users WHERE tag = '官方';
   ```

2. **tag 长度限制**：tag 最大长度为 20 个字符。

3. **exp 值**：
   - 70 级需要至少 13800 exp
   - 建议设置为 15000 exp 以确保达到 70 级
   - 最大等级为 70 级，超过 70 级仍显示为 70 级

4. **tag_updated_at**：更新 tag 时会自动更新 `tag_updated_at` 时间戳，这会影响 30 天修改限制。

## 示例

假设要更新用户名为 `admin` 的账户：

```bash
# 进入数据库
docker exec -it reforum-db-1 psql -U HuangWeiLong -d forum_db
```

```sql
-- 查看当前状态
SELECT id, username, tag, exp FROM users WHERE username = 'admin';

-- 更新为官方 tag 和 70 级
UPDATE users 
SET tag = '官方', 
    exp = 15000,
    tag_updated_at = CURRENT_TIMESTAMP
WHERE username = 'admin';

-- 验证结果
SELECT id, username, tag, exp FROM users WHERE username = 'admin';
```

执行完成后，输入 `\q` 退出 PostgreSQL 命令行。

